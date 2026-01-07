<?php

namespace App\Events;

use App\Models\OrderItem;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderItemStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderItem;
    public $status;
    public $oldStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(OrderItem $orderItem, string $status, ?string $oldStatus = null)
    {
        $this->orderItem = $orderItem;
        $this->status = $status;
        $this->oldStatus = $oldStatus ?? $orderItem->vendor_status;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.' . $this->orderItem->order_id),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'order_item_id' => $this->orderItem->id,
            'order_id' => $this->orderItem->order_id,
            'vendor_id' => $this->orderItem->vendor_id,
            'status' => $this->status,
            'old_status' => $this->oldStatus,
        ];
    }
}
