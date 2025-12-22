<?php

namespace App\Listeners;

use App\Events\OrderDelivered;
use App\Notifications\OrderDeliveredNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderDeliveredNotification implements ShouldQueue
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
     * @param  \App\Events\OrderDelivered  $event
     * @return void
     */
    public function handle(OrderDelivered $event)
    {
        $order = $event->order;
        $user = $order->user;

        // Send the order delivered notification
        $user->notify(new OrderDeliveredNotification($order));
    }
}
