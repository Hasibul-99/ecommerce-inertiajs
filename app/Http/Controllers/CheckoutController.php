<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $this->middleware('auth');
    }

    /**
     * Display the checkout page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->with('items.product', 'items.variant')
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        $addresses = $user->addresses;

        return Inertia::render('Checkout', [
            'cart' => $cart,
            'addresses' => $addresses,
            'paymentMethods' => $this->getAvailablePaymentMethods(),
        ]);
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
            ->with('items.product', 'items.variant')
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        try {
            DB::beginTransaction();

            // Create or update address
            $shippingAddress = $this->handleAddress($request, $user);

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $request->same_billing_address ? $shippingAddress->id : null,
                'payment_method' => $request->payment_method,
                'subtotal_cents' => $cart->getSubtotalCents(),
                'tax_cents' => $cart->getTaxCents(),
                'shipping_cents' => $cart->getShippingCents(),
                'total_cents' => $cart->getTotalCents(),
                'status' => 'pending',
            ]);

            // Create order items
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_variant_id' => $cartItem->product_variant_id,
                    'product_name' => $cartItem->product->title,
                    'quantity' => $cartItem->quantity,
                    'unit_price_cents' => $cartItem->price_cents,
                    'subtotal_cents' => $cartItem->quantity * $cartItem->price_cents,
                ]);
            }

            // Process payment
            $paymentResult = $this->processPayment($request, $order);

            if (!$paymentResult['success']) {
                throw new \Exception($paymentResult['message']);
            }

            // Clear the cart
            $cart->items()->delete();
            $cart->delete();

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
        // This is a placeholder for actual payment processing
        // In a real application, you would integrate with a payment gateway
        
        // For now, we'll simulate a successful payment
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing',
        ]);

        return [
            'success' => true,
            'message' => 'Payment processed successfully',
        ];
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
        ];
    }
}