<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Mail\OrderPlaced as OrderPlacedMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class NotifyVendorsOfNewOrder implements ShouldQueue
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

        // Get all vendors involved in this order
        $vendors = $order->items()
            ->with('product.vendor.user')
            ->get()
            ->pluck('product.vendor')
            ->filter()
            ->unique('id');

        // Notify each vendor
        foreach ($vendors as $vendor) {
            if ($vendor->user && $vendor->user->email) {
                Mail::to($vendor->user->email)
                    ->send(new OrderPlacedMail($order, true));
            }
        }
    }
}
