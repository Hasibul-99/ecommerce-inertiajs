<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CodDeliveryFailed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;
    public string $reason;
    public int $attemptNumber;

    /**
     * Create a new event instance.
     *
     * @param Order $order
     * @param string $reason
     * @param int $attemptNumber
     */
    public function __construct(Order $order, string $reason, int $attemptNumber)
    {
        $this->order = $order;
        $this->reason = $reason;
        $this->attemptNumber = $attemptNumber;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('order.' . $this->order->id),
        ];
    }
}
