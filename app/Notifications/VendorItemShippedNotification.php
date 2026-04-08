<?php

namespace App\Notifications;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorItemShippedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $orderItem;
    protected $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(OrderItem $orderItem)
    {
        $this->orderItem = $orderItem;
        $this->order = $orderItem->order;
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
        $message = (new MailMessage)
            ->subject('Your Order Item Has Been Shipped - Order #' . $this->order->order_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! An item from your order has been shipped.')
            ->line('**Order Number:** ' . $this->order->order_number)
            ->line('**Product:** ' . $this->orderItem->product->title);

        if ($this->orderItem->productVariant) {
            $message->line('**Variant:** ' . $this->orderItem->productVariant->name);
        }

        $message->line('**Quantity:** ' . $this->orderItem->quantity);

        if ($this->orderItem->carrier) {
            $message->line('**Carrier:** ' . $this->orderItem->carrier);
        }

        if ($this->orderItem->tracking_number) {
            $message->line('**Tracking Number:** ' . $this->orderItem->tracking_number);
        }

        if ($this->orderItem->estimated_delivery_at) {
            $message->line('**Estimated Delivery:** ' . $this->orderItem->estimated_delivery_at->format('F d, Y'));
        }

        $message->action('Track Your Order', route('orders.show', $this->order->id))
            ->line('Thank you for shopping with us!');

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
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'order_item_id' => $this->orderItem->id,
            'product_title' => $this->orderItem->product->title,
            'variant_name' => $this->orderItem->productVariant?->name,
            'quantity' => $this->orderItem->quantity,
            'carrier' => $this->orderItem->carrier,
            'tracking_number' => $this->orderItem->tracking_number,
            'shipped_at' => $this->orderItem->shipped_at,
            'estimated_delivery_at' => $this->orderItem->estimated_delivery_at,
            'message' => 'Your item has been shipped',
        ];
    }
}
