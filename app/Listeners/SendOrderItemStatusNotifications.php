<?php

namespace App\Listeners;

use App\Events\OrderItemStatusUpdated;
use App\Models\User;
use App\Notifications\AdminOrderItemStatusChangedNotification;
use App\Notifications\CustomerOrderItemStatusChangedNotification;
use App\Notifications\VendorItemShippedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendOrderItemStatusNotifications implements ShouldQueue
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
    public function handle(OrderItemStatusUpdated $event): void
    {
        $orderItem = $event->orderItem;
        $newStatus = $event->status;
        $oldStatus = $event->oldStatus;
        $order = $orderItem->order;
        $customer = $order->user;

        // Log the status change
        Log::info('Order item status updated', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'order_item_id' => $orderItem->id,
            'vendor_id' => $orderItem->vendor_id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ]);

        // 1. Notify Customer for significant status changes
        if (in_array($newStatus, ['confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered'])) {
            try {
                $customer->notify(new CustomerOrderItemStatusChangedNotification($orderItem, $newStatus));
                Log::info('Customer notified of order item status change', [
                    'customer_id' => $customer->id,
                    'order_item_id' => $orderItem->id,
                    'status' => $newStatus,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to notify customer', [
                    'customer_id' => $customer->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // 2. Send special "shipped" notification to customer
        if ($newStatus === 'shipped') {
            try {
                $customer->notify(new VendorItemShippedNotification($orderItem));
                Log::info('Customer notified of shipment', [
                    'customer_id' => $customer->id,
                    'order_item_id' => $orderItem->id,
                    'tracking_number' => $orderItem->tracking_number,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send shipment notification to customer', [
                    'customer_id' => $customer->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // 3. Notify Admin(s) of status changes
        try {
            $admins = User::whereHas('roles', function ($query) {
                $query->whereIn('name', ['admin', 'super-admin']);
            })->get();

            if ($admins->isNotEmpty()) {
                Notification::send(
                    $admins,
                    new AdminOrderItemStatusChangedNotification($orderItem, $newStatus, $oldStatus)
                );

                Log::info('Admins notified of order item status change', [
                    'admin_count' => $admins->count(),
                    'order_item_id' => $orderItem->id,
                    'status' => $newStatus,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to notify admins', [
                'order_item_id' => $orderItem->id,
                'error' => $e->getMessage(),
            ]);
        }

        // 4. Check if all items in the order are now shipped/delivered
        // and update overall order status (this is already handled in VendorOrderService)
        $this->checkAndUpdateOrderStatus($order);
    }

    /**
     * Check and update overall order status based on all items.
     */
    protected function checkAndUpdateOrderStatus($order): void
    {
        $allItems = $order->items;

        if ($allItems->isEmpty()) {
            return;
        }

        $allShipped = $allItems->every(fn($item) => in_array($item->vendor_status, ['shipped', 'delivered']));
        $allDelivered = $allItems->every(fn($item) => $item->vendor_status === 'delivered');
        $anyProcessing = $allItems->contains(fn($item) => in_array($item->vendor_status, ['processing', 'ready_to_ship']));

        $currentStatus = $order->status;
        $newStatus = null;

        if ($allDelivered && $currentStatus !== 'delivered') {
            $newStatus = 'delivered';
        } elseif ($allShipped && $currentStatus !== 'shipped') {
            $newStatus = 'shipped';
        } elseif ($anyProcessing && $currentStatus === 'pending') {
            $newStatus = 'processing';
        }

        if ($newStatus && $newStatus !== $currentStatus) {
            $order->update(['status' => $newStatus]);

            Log::info('Overall order status updated', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'old_status' => $currentStatus,
                'new_status' => $newStatus,
            ]);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(OrderItemStatusUpdated $event, \Throwable $exception): void
    {
        Log::error('Failed to process OrderItemStatusUpdated event', [
            'order_item_id' => $event->orderItem->id,
            'status' => $event->status,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
