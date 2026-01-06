<?php

namespace App\Listeners;

use App\Events\CodOrderOutForDelivery;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendCodOrderOutForDeliveryNotification implements ShouldQueue
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
     * @param CodOrderOutForDelivery $event
     * @return void
     */
    public function handle(CodOrderOutForDelivery $event): void
    {
        $order = $event->order;
        $deliveryPerson = $order->deliveryPerson;

        Log::info('COD Order Out For Delivery', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'delivery_person_id' => $deliveryPerson?->id,
            'customer_email' => $order->user->email,
        ]);

        // Send SMS/Email notification to customer
        // Example: SMS: "Your order #{$order->order_number} is out for delivery.
        // Delivery person: {$deliveryPerson->name}. Expected delivery today."

        // Notify customer
        // Notification::send($order->user, new CodOrderOutForDeliveryNotification($order));

        // Notify delivery person
        if ($deliveryPerson) {
            // Notification::send($deliveryPerson, new DeliveryAssignmentNotification($order));
            Log::info('Notifying delivery person about assignment', [
                'order_id' => $order->id,
                'delivery_person_id' => $deliveryPerson->id,
                'cod_amount' => $order->total_cents / 100,
            ]);
        }

        // Notify vendors
        foreach ($order->items as $item) {
            if ($item->product && $item->product->vendor_id) {
                $vendor = $item->product->vendor;
                Log::info('Notifying vendor about order out for delivery', [
                    'order_id' => $order->id,
                    'vendor_id' => $vendor->id,
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(CodOrderOutForDelivery $event, \Throwable $exception): void
    {
        Log::error('Failed to send COD order out for delivery notification', [
            'order_id' => $event->order->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
