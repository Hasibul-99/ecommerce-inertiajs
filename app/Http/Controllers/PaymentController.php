<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
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
     * Show the payment page for an order.
     *
     * @param  \App\Models\Order  $order
     * @return \Inertia\Response
     */
    public function show(Order $order)
    {
        $this->authorize('view', $order);

        // Only allow payment for pending orders
        if ($order->payment_status !== 'pending') {
            return redirect()->route('orders.show', $order)
                ->with('error', 'This order has already been paid for or cannot be paid at this time.');
        }

        return Inertia::render('Payment/Show', [
            'order' => $order->load('items.product'),
            'paymentMethods' => $this->getAvailablePaymentMethods(),
        ]);
    }

    /**
     * Process the payment for an order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function process(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        // Only allow payment for pending orders
        if ($order->payment_status !== 'pending') {
            return redirect()->route('orders.show', $order)
                ->with('error', 'This order has already been paid for or cannot be paid at this time.');
        }

        $request->validate([
            'payment_method' => 'required|string|in:credit_card,paypal,bank_transfer',
        ]);

        // Additional validation based on payment method
        if ($request->payment_method === 'credit_card') {
            $request->validate([
                'card_number' => 'required|string|min:13|max:19',
                'card_name' => 'required|string|max:255',
                'card_expiry_month' => 'required|string|size:2',
                'card_expiry_year' => 'required|string|size:2',
                'card_cvv' => 'required|string|size:3',
            ]);
        } elseif ($request->payment_method === 'paypal') {
            $request->validate([
                'paypal_email' => 'required|email',
            ]);
        } elseif ($request->payment_method === 'bank_transfer') {
            $request->validate([
                'bank_account_name' => 'required|string|max:255',
                'bank_account_number' => 'required|string|max:50',
            ]);
        }

        // In a real application, you would integrate with a payment gateway
        // For now, we'll simulate a successful payment

        // Create payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'amount_cents' => $order->total_cents,
            'payment_method' => $request->payment_method,
            'status' => 'completed',
            'transaction_id' => 'SIMULATED_' . uniqid(),
        ]);

        // Update order status
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing',
        ]);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Payment processed successfully.');
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