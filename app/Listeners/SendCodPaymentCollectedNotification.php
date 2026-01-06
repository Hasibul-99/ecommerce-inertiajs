<?php

namespace App\Listeners;

use App\Events\CodPaymentCollected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendCodPaymentCollectedNotification implements ShouldQueue
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
     * @param CodPaymentCollected $event
     * @return void
     */
    public function handle(CodPaymentCollected $event): void
    {
        $order = $event->order;
        $collectedBy = $order->codCollector;

        Log::info('COD Payment Collected', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount_collected' => $order->cod_amount_collected / 100,
            'collected_by' => $collectedBy?->name,
            'customer_email' => $order->user->email,
        ]);

        // Send confirmation to customer
        // SMS: "Thank you! Your order #{$order->order_number} has been delivered.
        // Payment of ${$order->cod_amount_collected / 100} received."

        // Notification::send($order->user, new CodPaymentCollectedNotification($order));

        // Notify admin about successful COD collection
        // $admins = User::role('admin')->get();
        // Notification::send($admins, new CodCollectionSuccessNotification($order));

        // Notify vendors about successful delivery and payment
        foreach ($order->items as $item) {
            if ($item->product && $item->product->vendor_id) {
                $vendor = $item->product->vendor;
                // Notification::send($vendor->user, new VendorOrderDeliveredNotification($order, $item));

                Log::info('Notifying vendor about successful COD collection', [
                    'order_id' => $order->id,
                    'vendor_id' => $vendor->id,
                    'item_amount' => $item->total_cents / 100,
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(CodPaymentCollected $event, \Throwable $exception): void
    {
        Log::error('Failed to send COD payment collected notification', [
            'order_id' => $event->order->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
