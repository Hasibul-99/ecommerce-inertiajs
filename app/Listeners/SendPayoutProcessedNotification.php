<?php

namespace App\Listeners;

use App\Events\PayoutProcessed;
use App\Notifications\PayoutProcessedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendPayoutProcessedNotification implements ShouldQueue
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
     * @param  \App\Events\PayoutProcessed  $event
     * @return void
     */
    public function handle(PayoutProcessed $event)
    {
        $payout = $event->payout;
        $vendor = $payout->vendor;

        // Send the payout processed notification to vendor
        if ($vendor && $vendor->user) {
            $vendor->user->notify(new PayoutProcessedNotification($payout));
        }
    }
}
