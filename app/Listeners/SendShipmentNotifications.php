<?php

namespace App\Listeners;

use App\Events\ShipmentInTransit;
use App\Events\ShipmentDelivered;
use App\Notifications\ShipmentShippedNotification;
use App\Notifications\ShipmentDeliveredNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle ShipmentInTransit event.
     */
    public function handleShipmentInTransit(ShipmentInTransit $event): void
    {
        $shipment = $event->shipment->load(['order', 'order.user']);

        if ($shipment->order && $shipment->order->user) {
            $shipment->order->user->notify(new ShipmentShippedNotification($shipment));
        }
    }

    /**
     * Handle ShipmentDelivered event.
     */
    public function handleShipmentDelivered(ShipmentDelivered $event): void
    {
        $shipment = $event->shipment->load(['order', 'order.user']);

        if ($shipment->order && $shipment->order->user) {
            $shipment->order->user->notify(new ShipmentDeliveredNotification($shipment));
        }
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe($events): array
    {
        return [
            ShipmentInTransit::class => 'handleShipmentInTransit',
            ShipmentDelivered::class => 'handleShipmentDelivered',
        ];
    }
}
