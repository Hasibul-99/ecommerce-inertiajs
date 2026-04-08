<?php

namespace App\Notifications;

use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomerOrderItemStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $orderItem;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct(OrderItem $orderItem, string $status)
    {
        $this->orderItem = $orderItem;
        $this->status = $status;
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
        $statusMessage = $this->getStatusMessage($this->status);

        $message = (new MailMessage)
            ->subject('Order Update - Order #' . $order->order_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your order has been updated.')
            ->line('**Order Number:** ' . $order->order_number)
            ->line('**Product:** ' . $this->orderItem->product->title);

        if ($this->orderItem->productVariant) {
            $message->line('**Variant:** ' . $this->orderItem->productVariant->name);
        }

        $message->line('**Status:** ' . $statusMessage)
            ->action('View Order Details', route('orders.show', $order->id))
            ->line('Thank you for your patience!');

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
            'product_title' => $this->orderItem->product->title,
            'variant_name' => $this->orderItem->productVariant?->name,
            'status' => $this->status,
            'message' => $this->getStatusMessage($this->status),
        ];
    }

    /**
     * Get friendly status message for customer.
     */
    protected function getStatusMessage(string $status): string
    {
        return match($status) {
            'pending' => 'Your order is pending',
            'confirmed' => 'Your order has been confirmed',
            'processing' => 'Your order is being processed',
            'ready_to_ship' => 'Your order is ready to ship',
            'shipped' => 'Your order has been shipped',
            'delivered' => 'Your order has been delivered',
            'cancelled' => 'Your order has been cancelled',
            'refunded' => 'Your order has been refunded',
            default => 'Order status: ' . ucfirst(str_replace('_', ' ', $status)),
        };
    }
}
