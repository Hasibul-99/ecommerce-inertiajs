<?php

namespace App\Listeners;

use App\Events\OrderCancelled;
use App\Notifications\OrderCancelledNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderCancelledNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\OrderCancelled  $event
     * @return void
     */
    public function handle(OrderCancelled $event)
    {
        $order = $event->order;
        $user = $order->user;

        // Send the order cancelled notification
        $user->notify(new OrderCancelledNotification($order));
    }
}
