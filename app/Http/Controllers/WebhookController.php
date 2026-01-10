<?php

namespace App\Http\Controllers;

use App\Events\OrderDelivered;
use App\Events\OrderShipped;
use App\Events\PaymentFailed;
use App\Models\Order;
use App\Models\OrderShipment;
use App\Models\Payment;
use App\Services\ShipmentTrackingService;
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

    /**
     * Handle DHL carrier webhook notifications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dhlTracking(Request $request)
    {
        try {
            if (!$this->verifyDhlSignature($request)) {
                Log::warning('Invalid DHL webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $payload = $request->all();
            Log::info('DHL tracking webhook received', ['payload' => $payload]);

            $trackingNumber = $payload['trackingNumber'] ?? $payload['shipmentTrackingNumber'] ?? null;

            if (!$trackingNumber) {
                return response()->json(['error' => 'Missing tracking number'], 400);
            }

            $shipment = OrderShipment::where('tracking_number', $trackingNumber)
                ->where('shipping_carrier', 'dhl')
                ->first();

            if (!$shipment) {
                Log::warning('Shipment not found for DHL webhook', ['tracking_number' => $trackingNumber]);
                return response()->json(['message' => 'Shipment not found'], 404);
            }

            $trackingService = app(ShipmentTrackingService::class);
            $trackingService->updateTrackingFromCarrier($shipment);

            return response()->json(['message' => 'Webhook processed successfully']);
        } catch (\Exception $e) {
            Log::error('DHL webhook error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle FedEx carrier webhook notifications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fedexTracking(Request $request)
    {
        try {
            if (!$this->verifyFedexSignature($request)) {
                Log::warning('Invalid FedEx webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $payload = $request->all();
            Log::info('FedEx tracking webhook received', ['payload' => $payload]);

            $trackingNumber = $payload['trackingNumber'] ?? $payload['trackingnumber'] ?? null;

            if (!$trackingNumber) {
                return response()->json(['error' => 'Missing tracking number'], 400);
            }

            $shipment = OrderShipment::where('tracking_number', $trackingNumber)
                ->where('shipping_carrier', 'fedex')
                ->first();

            if (!$shipment) {
                Log::warning('Shipment not found for FedEx webhook', ['tracking_number' => $trackingNumber]);
                return response()->json(['message' => 'Shipment not found'], 404);
            }

            $trackingService = app(ShipmentTrackingService::class);
            $trackingService->updateTrackingFromCarrier($shipment);

            return response()->json(['message' => 'Webhook processed successfully']);
        } catch (\Exception $e) {
            Log::error('FedEx webhook error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle UPS carrier webhook notifications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upsTracking(Request $request)
    {
        try {
            if (!$this->verifyUpsSignature($request)) {
                Log::warning('Invalid UPS webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $payload = $request->all();
            Log::info('UPS tracking webhook received', ['payload' => $payload]);

            $trackingNumber = $payload['trackingNumber'] ?? $payload['TrackingNumber'] ?? null;

            if (!$trackingNumber) {
                return response()->json(['error' => 'Missing tracking number'], 400);
            }

            $shipment = OrderShipment::where('tracking_number', $trackingNumber)
                ->where('shipping_carrier', 'ups')
                ->first();

            if (!$shipment) {
                Log::warning('Shipment not found for UPS webhook', ['tracking_number' => $trackingNumber]);
                return response()->json(['message' => 'Shipment not found'], 404);
            }

            $trackingService = app(ShipmentTrackingService::class);
            $trackingService->updateTrackingFromCarrier($shipment);

            return response()->json(['message' => 'Webhook processed successfully']);
        } catch (\Exception $e) {
            Log::error('UPS webhook error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle USPS carrier webhook notifications.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uspsTracking(Request $request)
    {
        try {
            if (!$this->verifyUspsSignature($request)) {
                Log::warning('Invalid USPS webhook signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $payload = $request->all();
            Log::info('USPS tracking webhook received', ['payload' => $payload]);

            $trackingNumber = $payload['trackingNumber'] ?? $payload['TrackingID'] ?? null;

            if (!$trackingNumber) {
                return response()->json(['error' => 'Missing tracking number'], 400);
            }

            $shipment = OrderShipment::where('tracking_number', $trackingNumber)
                ->where('shipping_carrier', 'usps')
                ->first();

            if (!$shipment) {
                Log::warning('Shipment not found for USPS webhook', ['tracking_number' => $trackingNumber]);
                return response()->json(['message' => 'Shipment not found'], 404);
            }

            $trackingService = app(ShipmentTrackingService::class);
            $trackingService->updateTrackingFromCarrier($shipment);

            return response()->json(['message' => 'Webhook processed successfully']);
        } catch (\Exception $e) {
            Log::error('USPS webhook error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Verify DHL webhook signature.
     *
     * @param Request $request
     * @return bool
     */
    protected function verifyDhlSignature(Request $request): bool
    {
        $secret = config('services.dhl.webhook_secret');
        if (!$secret) return true;

        $signature = $request->header('X-DHL-Signature');
        if (!$signature) return false;

        return hash_equals(hash_hmac('sha256', $request->getContent(), $secret), $signature);
    }

    /**
     * Verify FedEx webhook signature.
     *
     * @param Request $request
     * @return bool
     */
    protected function verifyFedexSignature(Request $request): bool
    {
        $secret = config('services.fedex.webhook_secret');
        if (!$secret) return true;

        $signature = $request->header('X-FedEx-Signature');
        if (!$signature) return false;

        return hash_equals(hash_hmac('sha256', $request->getContent(), $secret), $signature);
    }

    /**
     * Verify UPS webhook signature.
     *
     * @param Request $request
     * @return bool
     */
    protected function verifyUpsSignature(Request $request): bool
    {
        $secret = config('services.ups.webhook_secret');
        if (!$secret) return true;

        $signature = $request->header('X-UPS-Signature');
        if (!$signature) return false;

        return hash_equals(hash_hmac('sha256', $request->getContent(), $secret), $signature);
    }

    /**
     * Verify USPS webhook signature.
     *
     * @param Request $request
     * @return bool
     */
    protected function verifyUspsSignature(Request $request): bool
    {
        $secret = config('services.usps.webhook_secret');
        if (!$secret) return true;

        $signature = $request->header('X-USPS-Signature');
        if (!$signature) return false;

        return hash_equals(hash_hmac('sha256', $request->getContent(), $secret), $signature);
    }
}