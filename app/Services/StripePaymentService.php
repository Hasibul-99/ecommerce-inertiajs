<?php

namespace App\Services;

use App\Events\PaymentFailed;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class StripePaymentService
{
    /**
     * Create a payment intent for an order.
     *
     * @param  Order  $order
     * @return array
     */
    public function createPaymentIntent(Order $order): array
    {
        try {
            // In a real application with Stripe SDK installed:
            // \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
            //
            // $paymentIntent = \Stripe\PaymentIntent::create([
            //     'amount' => $order->total_cents,
            //     'currency' => 'usd',
            //     'metadata' => [
            //         'order_id' => $order->id,
            //         'order_number' => $order->order_number,
            //     ],
            //     'automatic_payment_methods' => [
            //         'enabled' => true,
            //     ],
            // ]);
            //
            // return [
            //     'success' => true,
            //     'client_secret' => $paymentIntent->client_secret,
            //     'payment_intent_id' => $paymentIntent->id,
            // ];

            // Simulated response for demo purposes
            return [
                'success' => true,
                'client_secret' => 'pi_simulated_' . uniqid() . '_secret_simulated',
                'payment_intent_id' => 'pi_simulated_' . uniqid(),
            ];

        } catch (\Exception $e) {
            Log::error('Stripe Payment Intent Creation Failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create payment intent: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Process a successful payment.
     *
     * @param  Order  $order
     * @param  array  $paymentData
     * @return Payment
     */
    public function processSuccessfulPayment(Order $order, array $paymentData): Payment
    {
        // Create payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'payment_id' => $paymentData['payment_intent_id'] ?? 'simulated_' . uniqid(),
            'amount_cents' => $order->total_cents,
            'currency' => 'usd',
            'payment_method' => $paymentData['payment_method'] ?? 'stripe',
            'status' => 'completed',
            'payment_details' => $paymentData,
        ]);

        // Update order status
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing',
        ]);

        return $payment;
    }

    /**
     * Process a PayPal payment.
     *
     * @param  Order  $order
     * @param  array  $paypalData
     * @return array
     */
    public function processPayPalPayment(Order $order, array $paypalData): array
    {
        try {
            // In a real application with PayPal SDK:
            // Process PayPal payment here

            // Simulated response
            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $order->user_id,
                'payment_id' => 'paypal_' . uniqid(),
                'amount_cents' => $order->total_cents,
                'currency' => 'usd',
                'payment_method' => 'paypal',
                'status' => 'completed',
                'payment_details' => $paypalData,
            ]);

            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
            ]);

            return [
                'success' => true,
                'payment' => $payment,
            ];

        } catch (\Exception $e) {
            Log::error('PayPal Payment Failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'PayPal payment failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Handle Stripe webhook events.
     *
     * @param  array  $payload
     * @return array
     */
    public function handleWebhook(array $payload): array
    {
        try {
            // In a real application:
            // Verify webhook signature
            // \Stripe\Webhook::constructEvent($payload, $signature, $webhookSecret);

            $event = $payload['type'] ?? null;
            $data = $payload['data']['object'] ?? [];

            switch ($event) {
                case 'payment_intent.succeeded':
                    return $this->handlePaymentIntentSucceeded($data);

                case 'payment_intent.payment_failed':
                    return $this->handlePaymentIntentFailed($data);

                case 'charge.refunded':
                    return $this->handleChargeRefunded($data);

                default:
                    return [
                        'success' => true,
                        'message' => 'Unhandled event type',
                    ];
            }

        } catch (\Exception $e) {
            Log::error('Stripe Webhook Error', [
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle successful payment intent.
     *
     * @param  array  $data
     * @return array
     */
    protected function handlePaymentIntentSucceeded(array $data): array
    {
        $orderId = $data['metadata']['order_id'] ?? null;

        if (!$orderId) {
            return [
                'success' => false,
                'message' => 'Order ID not found in metadata',
            ];
        }

        $order = Order::find($orderId);

        if (!$order) {
            return [
                'success' => false,
                'message' => 'Order not found',
            ];
        }

        $this->processSuccessfulPayment($order, [
            'payment_intent_id' => $data['id'] ?? null,
            'payment_method' => 'stripe',
        ]);

        return [
            'success' => true,
            'message' => 'Payment intent succeeded',
        ];
    }

    /**
     * Handle failed payment intent.
     *
     * @param  array  $data
     * @return array
     */
    protected function handlePaymentIntentFailed(array $data): array
    {
        $orderId = $data['metadata']['order_id'] ?? null;

        if ($orderId) {
            $order = Order::find($orderId);
            if ($order) {
                $order->update([
                    'payment_status' => 'failed',
                ]);

                // Dispatch payment failed event
                $failureReason = $data['last_payment_error']['message'] ?? 'Payment processing failed';
                event(new PaymentFailed($order, $failureReason));
            }
        }

        return [
            'success' => true,
            'message' => 'Payment intent failed',
        ];
    }

    /**
     * Handle charge refunded.
     *
     * @param  array  $data
     * @return array
     */
    protected function handleChargeRefunded(array $data): array
    {
        // Handle refund logic here
        Log::info('Charge Refunded', $data);

        return [
            'success' => true,
            'message' => 'Charge refunded',
        ];
    }

    /**
     * Create a refund for a payment.
     *
     * @param  Payment  $payment
     * @param  int|null  $amountCents
     * @param  string|null  $reason
     * @return array
     */
    public function createRefund(Payment $payment, ?int $amountCents = null, ?string $reason = null): array
    {
        try {
            // In a real application with Stripe SDK:
            // $refund = \Stripe\Refund::create([
            //     'payment_intent' => $payment->payment_id,
            //     'amount' => $amountCents ?? $payment->amount_cents,
            //     'reason' => $reason ?? 'requested_by_customer',
            // ]);

            // Simulated response
            $payment->update([
                'status' => 'refunded',
            ]);

            $payment->order->update([
                'payment_status' => 'refunded',
                'status' => 'cancelled',
            ]);

            return [
                'success' => true,
                'message' => 'Refund processed successfully',
                'refund_id' => 'refund_simulated_' . uniqid(),
            ];

        } catch (\Exception $e) {
            Log::error('Stripe Refund Failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Refund failed: ' . $e->getMessage(),
            ];
        }
    }
}
