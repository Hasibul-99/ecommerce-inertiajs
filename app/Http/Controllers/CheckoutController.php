<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Cart;
use App\Models\Commission;
use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\ProductVariant;
use App\Models\Vendor;
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

        // Create inventory reservations for each item in the cart
        $reservationResults = $this->createInventoryReservations($cart);
        
        if (!$reservationResults['success']) {
            return redirect()->route('cart')->with('error', $reservationResults['message']);
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
                        'image' => $item->product->images->first()?->url ?? null,
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
            $wishlistCount = \App\Models\Wishlist::where('user_id', auth()->id())->count();
        }

        return Inertia::render('Checkout/Index', [
            'cart' => $formattedCart,
            'addresses' => $addresses,
            'paymentMethods' => $this->getAvailablePaymentMethods(),
            'reservation_id' => $reservationResults['reservation_id'],
            'cartCount' => $cart->items->count(),
            'wishlistCount' => $wishlistCount,
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
            ->with('items.product', 'items.productVariant')
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        // Verify inventory reservations are still valid
        $reservations = InventoryReservation::where('reservation_id', $request->reservation_id)
            ->where('expires_at', '>', now())
            ->get();
            
        if ($reservations->isEmpty()) {
            return redirect()->route('checkout')->with('error', 'Your checkout session has expired. Please try again.');
        }

        try {
            DB::beginTransaction();

            // Create or update address
            $shippingAddress = $this->handleAddress($request, $user);

            // Create order with unique order number
            $orderNumber = 'ORD-' . strtoupper(uniqid());
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $request->same_billing_address ? $shippingAddress->id : null,
                'payment_method' => $request->payment_method,
                'subtotal_cents' => $cart->subtotal_cents,
                'tax_cents' => $cart->tax_cents,
                'shipping_cents' => $cart->shipping_cents ?? 0,
                'total_cents' => $cart->total_cents,
                'status' => 'pending',
                'metadata' => [
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
            ]);

            // Create order items and calculate commissions
            foreach ($cart->items as $cartItem) {
                $variant = $cartItem->productVariant;
                $product = $cartItem->product;
                
                // Create product snapshot for historical record
                $productSnapshot = [
                    'id' => $product->id,
                    'title' => $product->title,
                    'description' => $product->description,
                    'variant' => [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'sku' => $variant->sku,
                    ],
                ];
                
                // Create order item
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_variant_id' => $cartItem->product_variant_id,
                    'product_name' => $product->title,
                    'quantity' => $cartItem->quantity,
                    'unit_price_cents' => $cartItem->price_cents,
                    'subtotal_cents' => $cartItem->quantity * $cartItem->price_cents,
                    'tax_cents' => (int)($cartItem->quantity * $cartItem->price_cents * 0.1), // 10% tax
                    'total_cents' => $cartItem->quantity * $cartItem->price_cents * 1.1, // Including tax
                    'product_snapshot' => $productSnapshot,
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
                $variant = ProductVariant::find($cartItem->product_variant_id);
                $variant->decrement('stock_quantity', $cartItem->quantity);
            }
            
            // Remove inventory reservations
            InventoryReservation::where('reservation_id', $request->reservation_id)->delete();

            // Clear the cart
            $cart->items()->delete();
            $cart->delete();
            
            // Dispatch events
            event(new OrderPlaced($order));
            event(new OrderPaid($order));

            DB::commit();

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Your order has been placed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
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
            // Create new address
            return Address::create([
                'user_id' => $user->id,
                'name' => $request->shipping_name,
                'address_line1' => $request->shipping_address_line1,
                'address_line2' => $request->shipping_address_line2,
                'city' => $request->shipping_city,
                'state' => $request->shipping_state,
                'postal_code' => $request->shipping_postal_code,
                'country' => $request->shipping_country,
                'phone' => $request->shipping_phone,
                'is_default' => $request->save_address ? true : false,
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
    protected function processPayment(CheckoutRequest $request, Order $order)
    {
        // Handle different payment methods
        if ($request->payment_method === 'cod') {
            // For Cash on Delivery, mark as unpaid but order is still valid
            $order->update([
                'payment_method' => 'cod',
                'payment_status' => 'unpaid',
                'status' => 'pending',
            ]);

            return [
                'success' => true,
                'message' => 'Order placed successfully with Cash on Delivery',
            ];
        } elseif ($request->payment_method === 'stripe' || $request->payment_method === 'credit_card') {
            // Use Stripe payment service
            $paymentService = new \App\Services\StripePaymentService();

            // Create payment intent
            $result = $paymentService->createPaymentIntent($order);

            if (!$result['success']) {
                return $result;
            }

            // In a real application, you would return the client_secret to the frontend
            // For now, simulate successful payment
            $paymentService->processSuccessfulPayment($order, [
                'payment_intent_id' => $result['payment_intent_id'],
                'payment_method' => 'stripe',
            ]);

            return [
                'success' => true,
                'message' => 'Payment processed successfully',
                'client_secret' => $result['client_secret'],
            ];
        } elseif ($request->payment_method === 'paypal') {
            // Use PayPal payment service
            $paymentService = new \App\Services\StripePaymentService();

            $result = $paymentService->processPayPalPayment($order, [
                'paypal_email' => $request->paypal_email ?? null,
            ]);

            return $result;
        } else {
            // Other payment methods - mark as pending payment
            $order->update([
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'status' => 'pending',
            ]);

            return [
                'success' => true,
                'message' => 'Order placed successfully. Payment pending.',
            ];
        }
    }

    /**
     * Get available payment methods.
     *
     * @return array
     */
    protected function getAvailablePaymentMethods()
    {
        return [
            ['id' => 'credit_card', 'name' => 'Credit Card'],
            ['id' => 'paypal', 'name' => 'PayPal'],
            ['id' => 'bank_transfer', 'name' => 'Bank Transfer'],
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