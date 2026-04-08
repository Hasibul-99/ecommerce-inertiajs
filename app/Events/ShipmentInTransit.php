<?php

namespace App\Events;

use App\Models\OrderShipment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShipmentInTransit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public OrderShipment $shipment;

    /**
     * Create a new event instance.
     */
    public function __construct(OrderShipment $shipment)
    {
        $this->shipment = $shipment;
    }
}
