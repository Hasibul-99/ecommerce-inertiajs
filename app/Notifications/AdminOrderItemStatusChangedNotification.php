<?php

namespace App\Notifications;

use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminOrderItemStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $orderItem;
    protected $newStatus;
    protected $oldStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(OrderItem $orderItem, string $newStatus, ?string $oldStatus = null)
    {
        $this->orderItem = $orderItem;
        $this->newStatus = $newStatus;
        $this->oldStatus = $oldStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->orderItem->order;
        $vendor = $this->orderItem->vendor;

        $message = (new MailMessage)
            ->subject('Order Item Status Updated - Order #' . $order->order_number)
            ->greeting('Hello Admin!')
            ->line('An order item status has been updated by a vendor.');

        $message->line('**Order Number:** ' . $order->order_number)
            ->line('**Vendor:** ' . $vendor->business_name)
            ->line('**Product:** ' . $this->orderItem->product->title);

        if ($this->orderItem->productVariant) {
            $message->line('**Variant:** ' . $this->orderItem->productVariant->name);
        }

        if ($this->oldStatus) {
            $message->line('**Old Status:** ' . ucfirst(str_replace('_', ' ', $this->oldStatus)));
        }

        $message->line('**New Status:** ' . ucfirst(str_replace('_', ' ', $this->newStatus)))
            ->action('View Order', route('admin.orders.show', $order->id))
            ->line('This is an automated notification from the vendor order management system.');

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->orderItem->order->id,
            'order_number' => $this->orderItem->order->order_number,
            'order_item_id' => $this->orderItem->id,
            'vendor_id' => $this->orderItem->vendor_id,
            'vendor_name' => $this->orderItem->vendor->business_name,
            'product_title' => $this->orderItem->product->title,
            'variant_name' => $this->orderItem->productVariant?->name,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => 'Order item status changed from ' . ($this->oldStatus ?? 'unknown') . ' to ' . $this->newStatus,
        ];
    }
}
