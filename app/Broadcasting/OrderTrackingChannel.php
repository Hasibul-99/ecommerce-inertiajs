<?php

namespace App\Broadcasting;

use App\Models\Order;
use App\Models\User;

class OrderTrackingChannel
{
    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, int $orderId): array|bool
    {
        $order = Order::find($orderId);

        if (!$order) {
            return false;
        }

        // User can join if they own the order or are an admin/vendor
        return $order->user_id === $user->id ||
               $user->hasRole(['admin', 'super-admin']) ||
               ($user->hasRole('vendor') && $order->items()->where('vendor_id', $user->vendor->id)->exists());
    }
}
