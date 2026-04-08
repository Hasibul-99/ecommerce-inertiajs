<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Notifications\VendorNewOrderNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyVendorsOfNewOrder implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order;

        // Load order items with product and vendor relationships
        $order->load(['items.product.vendor.user']);

        // Group items by vendor
        $vendorGroups = $order->items->groupBy(function ($item) {
            return $item->product->vendor_id;
        });

        // Send notification to each vendor
        foreach ($vendorGroups as $vendorId => $items) {
            $vendor = $items->first()->product->vendor;

            // Skip if vendor has no user
            if (!$vendor || !$vendor->user) {
                continue;
            }

            // Calculate total for this vendor
            $vendorTotal = $items->sum('subtotal_cents');

            // Send notification to vendor's user
            $vendor->user->notify(new VendorNewOrderNotification(
                $order,
                $items,
                $vendorTotal
            ));
        }
    }
}
