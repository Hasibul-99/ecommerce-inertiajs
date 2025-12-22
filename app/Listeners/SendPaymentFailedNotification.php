<?php

namespace App\Listeners;

use App\Events\PaymentFailed;
use App\Notifications\PaymentFailedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendPaymentFailedNotification implements ShouldQueue
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
     * @param  \App\Events\PaymentFailed  $event
     * @return void
     */
    public function handle(PaymentFailed $event)
    {
        $order = $event->order;
        $user = $order->user;

        // Send the payment failed notification
        $user->notify(new PaymentFailedNotification($order, $event->reason));
    }
}
