<?php

namespace App\Listeners;

use App\Events\CodDeliveryFailed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendCodDeliveryFailedNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param CodDeliveryFailed $event
     * @return void
     */
    public function handle(CodDeliveryFailed $event): void
    {
        $order = $event->order;
        $reason = $event->reason;
        $attemptNumber = $event->attemptNumber;

        Log::warning('COD Delivery Failed', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'reason' => $reason,
            'attempt_number' => $attemptNumber,
            'customer_email' => $order->user->email,
        ]);

        // Send notification to customer
        // SMS: "Delivery attempt #{$attemptNumber} for order #{$order->order_number} was unsuccessful.
        // Reason: {$reason}. We will contact you to reschedule."

        // Notification::send($order->user, new CodDeliveryFailedNotification($order, $reason, $attemptNumber));

        // Notify admin about failed delivery
        // $admins = User::role('admin')->get();
        // Notification::send($admins, new DeliveryFailureAlertNotification($order, $reason, $attemptNumber));

        // If this is the 3rd attempt, escalate
        if ($attemptNumber >= 3) {
            Log::critical('Multiple delivery failures for COD order', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'attempts' => $attemptNumber,
            ]);

            // Escalate to customer service team
            // Notification::send($customerServiceTeam, new DeliveryEscalationNotification($order));
        }

        // Notify vendors
        foreach ($order->items as $item) {
            if ($item->product && $item->product->vendor_id) {
                $vendor = $item->product->vendor;
                Log::info('Notifying vendor about delivery failure', [
                    'order_id' => $order->id,
                    'vendor_id' => $vendor->id,
                    'reason' => $reason,
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(CodDeliveryFailed $event, \Throwable $exception): void
    {
        Log::error('Failed to send COD delivery failed notification', [
            'order_id' => $event->order->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
