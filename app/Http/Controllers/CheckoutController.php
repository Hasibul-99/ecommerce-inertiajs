<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Cart;
use App\Models\Commission;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\ProductVariant;
use App\Models\Vendor;
use App\Services\CodService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\OrderPaid;
use App\Events\OrderPlaced;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Only require auth for processing checkout, not for starting checkout
        $this->middleware('auth')->only(['process']);
    }

    /**
     * Display the checkout page.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get cart based on user or session
        $cart = $this->getCart($request);

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        // Get user addresses if authenticated
        $addresses = Auth::check() ? Auth::user()->addresses : [];

        // Format cart for frontend
        $formattedCart = [
            'items' => $cart->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'name' => $item->product->name,
                        'image' => $item->product->getFirstMediaUrl('images') ?: null,
                    ],
                    'quantity' => $item->quantity,
                    'price_cents' => $item->price_cents ?? $item->product->price,
                ];
            }),
            'subtotal_cents' => $cart->subtotal_cents ?? $this->calculateCartSubtotal($cart),
            'tax_cents' => $cart->tax_cents ?? $this->calculateCartTax($cart),
            'total_cents' => $cart->total_cents ?? $this->calculateCartTotal($cart),
        ];

        // Get wishlist count
        $wishlistCount = 0;
        if (auth()->check()) {
            $wishlistCount = \App\Models\Wishlist::getItemCountForUser(auth()->id());
        }

        // Get COD availability info (availability checked on submission, not here)
        $codService = new CodService();
        $codInfo = [
            'available' => config('cod.enabled', true),
            'fee_cents' => $codService->getCodFee($formattedCart['total_cents']),
            'min_order_amount_cents' => $codService->getMinOrderAmount(),
            'max_order_amount_cents' => $codService->getMaxOrderAmount(),
            'delivery_estimate' => $codService->getDeliveryTimeEstimate(),
            'instructions' => $codService->getPaymentInstructions(),
            'errors' => [],
        ];

        return Inertia::render('Checkout/Index', [
            'cart' => $formattedCart,
            'addresses' => $addresses,
            'paymentMethods' => $this->getAvailablePaymentMethods(),
            'cartCount' => $cart->items->count(),
            'wishlistCount' => $wishlistCount,
            'codInfo' => $codInfo,
        ]);
    }

    /**
     * Calculate cart subtotal
     */
    private function calculateCartSubtotal($cart)
    {
        return $cart->items->sum(function ($item) {
            $price = $item->price_cents ?? $item->product->price;
            return $price * $item->quantity;
        });
    }

    /**
     * Calculate cart tax
     */
    private function calculateCartTax($cart)
    {
        return (int)($this->calculateCartSubtotal($cart) * 0.1);
    }

    /**
     * Calculate cart total
     */
    private function calculateCartTotal($cart)
    {
        return $this->calculateCartSubtotal($cart) + $this->calculateCartTax($cart);
    }

    /**
     * Process the checkout.
     *
     * @param  \App\Http\Requests\CheckoutRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function process(CheckoutRequest $request)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->with('items.product.media', 'items.productVariant')
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        // Validate COD is globally enabled
        if (!config('cod.enabled', true)) {
            return redirect()->back()->with('error', 'Cash on Delivery is not available at this time.');
        }

        $codService = new CodService();
        $orderAmountCents = $cart->total_cents > 0
            ? $cart->total_cents
            : $this->calculateCartTotal($cart);

        // Check order amount limits only (address / phone validated on save)
        if ($orderAmountCents < $codService->getMinOrderAmount()) {
            $min = number_format($codService->getMinOrderAmount() / 100, 2);
            return redirect()->back()->with('error', "COD is only available for orders above ৳$min.");
        }
        if ($orderAmountCents > $codService->getMaxOrderAmount()) {
            $max = number_format($codService->getMaxOrderAmount() / 100, 2);
            return redirect()->back()->with('error', "COD is not available for orders above ৳$max.");
        }

        try {
            DB::beginTransaction();

            // Create or update address
            $shippingAddress = $this->handleAddress($request, $user);

            // Calculate subtotal / totals from cart items (source of truth)
            $calculatedSubtotal = $this->calculateCartSubtotal($cart);
            $calculatedTax      = $this->calculateCartTax($cart);
            $calculatedTotal    = $calculatedSubtotal + $calculatedTax;

            // Calculate COD fee
            $codFeeCents = $codService->getCodFee($calculatedTotal);
            $highValueThreshold = config('cod.high_value_threshold_cents', 1000000);
            $codVerificationRequired = $calculatedTotal >= $highValueThreshold;

            // Create order with unique order number
            $orderNumber = 'ORD-' . strtoupper(uniqid());
            $totalCents  = $calculatedTotal + $codFeeCents;

            $order = Order::create([
                'user_id'                   => $user->id,
                'order_number'              => $orderNumber,
                'shipping_address_id'       => $shippingAddress->id,
                'billing_address_id'        => $request->same_billing_address ? $shippingAddress->id : null,
                'payment_method'            => $request->payment_method,
                'subtotal_cents'            => $calculatedSubtotal,
                'tax_cents'                 => $calculatedTax,
                'shipping_cents'            => 0,
                'total_cents'               => $totalCents,
                'cod_fee_cents'             => $codFeeCents,
                'cod_verification_required' => $codVerificationRequired,
                'status'                    => 'pending',
                'metadata'                  => [
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
            ]);

            // Create order items and calculate commissions
            foreach ($cart->items as $cartItem) {
                $variant = $cartItem->productVariant;
                $product = $cartItem->product;
                
                $productName = $product->title ?? $product->name ?? 'Product';

                // Create product snapshot for historical record
                $productSnapshot = [
                    'id'      => $product->id,
                    'title'   => $productName,
                    'variant' => $variant ? [
                        'id'   => $variant->id,
                        'name' => $variant->name,
                        'sku'  => $variant->sku,
                    ] : null,
                ];

                // Create order item
                $itemSubtotal = $cartItem->quantity * $cartItem->price_cents;
                $itemTax      = (int)($itemSubtotal * 0.1);
                $orderItem = OrderItem::create([
                    'order_id'           => $order->id,
                    'product_id'         => $cartItem->product_id,
                    'product_variant_id' => $cartItem->product_variant_id,
                    'vendor_id'          => $product->vendor_id,
                    'product_name'       => $productName,
                    'quantity'           => $cartItem->quantity,
                    'unit_price_cents'   => $cartItem->price_cents,
                    'subtotal_cents'     => $itemSubtotal,
                    'tax_cents'          => $itemTax,
                    'total_cents'        => $itemSubtotal + $itemTax,
                    'product_snapshot'   => $productSnapshot,
                ]);
                
                // Calculate and create commission if product has a vendor
                if ($product->vendor_id) {
                    $vendor = Vendor::find($product->vendor_id);
                    $commissionRate = $vendor->commission_rate ?? config('marketplace.default_commission_rate', 0.1); // Default 10%
                    
                    Commission::create([
                        'order_item_id' => $orderItem->id,
                        'vendor_id' => $product->vendor_id,
                        'amount_cents' => (int)($orderItem->subtotal_cents * $commissionRate),
                        'rate' => $commissionRate,
                    ]);
                }
            }

            // Process payment
            $paymentResult = $this->processPayment($request, $order);

            if (!$paymentResult['success']) {
                throw new \Exception($paymentResult['message']);
            }
            
            // Update inventory - decrement stock for each variant
            foreach ($cart->items as $cartItem) {
                if ($cartItem->product_variant_id) {
                    $variant = ProductVariant::find($cartItem->product_variant_id);
                    $variant?->decrement('stock_quantity', $cartItem->quantity);
                }
            }
            
            // Clear the cart
            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            // Dispatch events after commit — email failures must not roll back the order
            try {
                event(new OrderPlaced($order));
                event(new OrderPaid($order));
            } catch (\Throwable $e) {
                \Log::warning('Post-order event failed (order was saved)', [
                    'order_id' => $order->id,
                    'error'    => $e->getMessage(),
                ]);
            }

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Your order has been placed successfully.');

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Checkout failed', ['user_id' => $user->id, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Checkout failed: ' . $e->getMessage());
        }
    }

    /**
     * Handle address creation or update.
     *
     * @param  \App\Http\Requests\CheckoutRequest  $request
     * @param  \App\Models\User  $user
     * @return \App\Models\Address
     */
    protected function handleAddress(CheckoutRequest $request, $user)
    {
        if ($request->shipping_address_id) {
            $address = Address::findOrFail($request->shipping_address_id);
            
            // Ensure the address belongs to the user
            if ($address->user_id !== $user->id) {
                throw new \Exception('Invalid address selected.');
            }
            
            return $address;
        } else {
            // Split full name into first / last
            $nameParts = explode(' ', trim($request->shipping_name), 2);
            $firstName = $nameParts[0];
            $lastName  = $nameParts[1] ?? $nameParts[0];

            return Address::create([
                'user_id'        => $user->id,
                'first_name'     => $firstName,
                'last_name'      => $lastName,
                'address_line_1' => $request->shipping_address_line1,
                'address_line_2' => $request->shipping_address_line2,
                'city'           => $request->shipping_city,
                'state'          => $request->shipping_state,
                'postal_code'    => $request->shipping_postal_code,
                'country'        => $request->shipping_country,
                'phone'          => $request->shipping_phone,
                'is_default'     => (bool) $request->save_address,
            ]);
        }
    }

    /**
     * Process payment for the order.
     *
     * @param  \App\Http\Requests\CheckoutRequest  $request
     * @param  \App\Models\Order  $order
     * @return array
     */
    protected function processPayment(CheckoutRequest $request, Order $order): array
    {
        $codService = new CodService();

        $order->update([
            'payment_method'     => 'cod',
            'payment_status'     => 'unpaid',
            'status'             => 'processing',
            'fulfillment_status' => 'awaiting_delivery',
        ]);

        return [
            'success' => true,
            'message' => 'Order placed successfully with Cash on Delivery. ' .
                'Payment will be collected upon delivery in ' .
                $codService->getDeliveryTimeEstimate()['text'] . '.',
        ];
    }

    /**
     * Get available payment methods.
     *
     * @return array
     */
    protected function getAvailablePaymentMethods(): array
    {
        return [
            ['id' => 'cod', 'name' => 'Cash on Delivery'],
        ];
    }
    
    /**
     * Get cart based on user or session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \App\Models\Cart|null
     */
    protected function getCart(Request $request)
    {
        if (Auth::check()) {
            return Cart::where('user_id', Auth::id())
                ->with('items.product', 'items.productVariant')
                ->first();
        } else {
            $cartToken = $request->header('X-Cart-Token');
            
            if ($cartToken) {
                return Cart::where('session_id', $cartToken)
                    ->with('items.product', 'items.productVariant')
                    ->first();
            }
        }
        
        return null;
    }
    
    /**
     * Create inventory reservations for each item in the cart.
     *
     * @param  \App\Models\Cart  $cart
     * @return array
     */
    protected function createInventoryReservations(Cart $cart)
    {
        $reservationId = uniqid('res_');
        $expiresAt = now()->addMinutes(15);
        
        try {
            DB::beginTransaction();
            
            foreach ($cart->items as $cartItem) {
                $variant = ProductVariant::lockForUpdate()->find($cartItem->product_variant_id);
                
                // Check if there's enough stock available
                $reservedQuantity = InventoryReservation::where('product_variant_id', $variant->id)
                    ->where('expires_at', '>', now())
                    ->sum('quantity');
                    
                $availableStock = $variant->stock_quantity - $reservedQuantity;
                
                if ($availableStock < $cartItem->quantity) {
                    DB::rollBack();
                    return [
                        'success' => false,
                        'message' => "Sorry, there are only {$availableStock} units of {$cartItem->product->title} available."
                    ];
                }
                
                // Create reservation
                InventoryReservation::create([
                    'reservation_id' => $reservationId,
                    'product_variant_id' => $variant->id,
                    'cart_item_id' => $cartItem->id,
                    'quantity' => $cartItem->quantity,
                    'expires_at' => $expiresAt,
                ]);
            }
            
            DB::commit();
            
            return [
                'success' => true,
                'reservation_id' => $reservationId,
                'expires_at' => $expiresAt,
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return [
                'success' => false,
                'message' => 'Failed to reserve inventory: ' . $e->getMessage(),
            ];
        }
    }
}