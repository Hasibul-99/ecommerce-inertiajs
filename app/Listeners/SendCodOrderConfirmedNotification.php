<?php

namespace App\Listeners;

use App\Events\CodOrderConfirmed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendCodOrderConfirmedNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param CodOrderConfirmed $event
     * @return void
     */
    public function handle(CodOrderConfirmed $event): void
    {
        $order = $event->order;

        Log::info('COD Order Confirmed', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'customer_email' => $order->user->email,
        ]);

        // In a real application, send SMS/Email notification to customer
        // Example: Notification::send($order->user, new CodOrderConfirmedNotification($order));

        // Notify customer
        // SMS: "Your order #{$order->order_number} has been confirmed. We are preparing it for delivery."

        // Notify vendors
        foreach ($order->items as $item) {
            if ($item->product && $item->product->vendor_id) {
                $vendor = $item->product->vendor;
                // Send notification to vendor
                // Notification::send($vendor->user, new VendorOrderConfirmedNotification($order, $item));

                Log::info('Notifying vendor about confirmed order', [
                    'order_id' => $order->id,
                    'vendor_id' => $vendor->id,
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(CodOrderConfirmed $event, \Throwable $exception): void
    {
        Log::error('Failed to send COD order confirmed notification', [
            'order_id' => $event->order->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
