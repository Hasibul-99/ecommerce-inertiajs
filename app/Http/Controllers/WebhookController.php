<?php

namespace App\Http\Controllers;

use App\Events\OrderDelivered;
use App\Events\OrderShipped;
use App\Events\PaymentFailed;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle payment gateway webhooks.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function handlePaymentWebhook(Request $request)
    {
        // Log the webhook payload for debugging
        Log::info('Payment webhook received', ['payload' => $request->all()]);

        try {
            // Use Stripe payment service to handle webhook
            $paymentService = new \App\Services\StripePaymentService();
            $result = $paymentService->handleWebhook($request->all());

            if ($result['success']) {
                return response()->json(['status' => 'success']);
            } else {
                return response()->json(['status' => 'error', 'message' => $result['message']], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error processing payment webhook', [
                'error' => $e->getMessage(),
                'payload' => $request->all(),
            ]);

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle shipping carrier webhooks.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function handleShippingWebhook(Request $request)
    {
        // Verify webhook signature
        // In a real application, you would verify the webhook signature from the shipping carrier

        // Log the webhook payload for debugging
        Log::info('Shipping webhook received', ['payload' => $request->all()]);

        try {
            // Process the webhook based on the event type
            $eventType = $request->input('event_type');
            $trackingNumber = $request->input('tracking_number');
            $status = $request->input('status');

            // Find the order by tracking number
            $order = Order::where('tracking_number', $trackingNumber)->first();

            if (!$order) {
                Log::warning('Order not found for tracking number', ['tracking_number' => $trackingNumber]);
                return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
            }

            switch ($eventType) {
                case 'tracking.created':
                    // Update order with tracking information
                    $order->update([
                        'tracking_number' => $trackingNumber,
                        'shipping_carrier' => $request->input('carrier'),
                        'status' => 'shipped',
                    ]);

                    // Dispatch order shipped event
                    event(new OrderShipped($order));
                    break;

                case 'tracking.updated':
                    // Update order status based on shipping status
                    if ($status === 'delivered') {
                        $order->update(['status' => 'delivered']);

                        // Dispatch order delivered event
                        event(new OrderDelivered($order));
                    } elseif ($status === 'returned') {
                        $order->update(['status' => 'returned']);
                    }
                    break;

                default:
                    // Ignore other event types
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Error processing shipping webhook', [
                'error' => $e->getMessage(),
                'payload' => $request->all(),
            ]);

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle successful payment.
     *
     * @param  string  $paymentId
     * @param  array  $payload
     * @return void
     */
    protected function handlePaymentSucceeded($paymentId, $payload)
    {
        // Find the payment by transaction ID
        $payment = Payment::where('transaction_id', $paymentId)->first();

        if (!$payment) {
            Log::warning('Payment not found for transaction ID', ['transaction_id' => $paymentId]);
            return;
        }

        // Update payment status
        $payment->update([
            'status' => 'completed',
            'metadata' => json_encode($payload),
        ]);

        // Update order status
        $order = $payment->order;
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing',
        ]);
    }

    /**
     * Handle failed payment.
     *
     * @param  string  $paymentId
     * @param  array  $payload
     * @return void
     */
    protected function handlePaymentFailed($paymentId, $payload)
    {
        // Find the payment by transaction ID
        $payment = Payment::where('transaction_id', $paymentId)->first();

        if (!$payment) {
            Log::warning('Payment not found for transaction ID', ['transaction_id' => $paymentId]);
            return;
        }

        // Update payment status
        $payment->update([
            'status' => 'failed',
            'metadata' => json_encode($payload),
        ]);

        // Update order status
        $order = $payment->order;
        $order->update([
            'payment_status' => 'failed',
        ]);

        // Dispatch payment failed event
        $failureReason = $payload['failure_message'] ?? 'Payment processing failed';
        event(new PaymentFailed($order, $failureReason));
    }

    /**
     * Handle refund.
     *
     * @param  string  $paymentId
     * @param  array  $payload
     * @return void
     */
    protected function handleRefund($paymentId, $payload)
    {
        // Find the payment by transaction ID
        $payment = Payment::where('transaction_id', $paymentId)->first();

        if (!$payment) {
            Log::warning('Payment not found for transaction ID', ['transaction_id' => $paymentId]);
            return;
        }

        // Update payment status
        $payment->update([
            'status' => 'refunded',
            'metadata' => json_encode($payload),
        ]);

        // Update order status
        $order = $payment->order;
        $order->update([
            'payment_status' => 'refunded',
            'status' => 'refunded',
        ]);
    }
}