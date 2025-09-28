<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Notifications\OrderPlacedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderConfirmation implements ShouldQueue
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
     * @param  \App\Events\OrderPlaced  $event
     * @return void
     */
    public function handle(OrderPlaced $event)
    {
        $order = $event->order;
        $user = $order->user;
        
        // Send the order confirmation notification
        $user->notify(new OrderPlacedNotification($order));
    }
}