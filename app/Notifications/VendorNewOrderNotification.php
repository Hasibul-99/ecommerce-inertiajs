<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorNewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $order;
    public $vendorItems;
    public $vendorTotal;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, $vendorItems, $vendorTotal)
    {
        $this->order = $order;
        $this->vendorItems = $vendorItems;
        $this->vendorTotal = $vendorTotal;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $itemsCount = $this->vendorItems->count();
        $totalAmount = number_format($this->vendorTotal / 100, 2);

        return (new MailMessage)
                    ->subject('New Order Received - #' . $this->order->order_number)
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('You have received a new order.')
                    ->line('**Order #:** ' . $this->order->order_number)
                    ->line('**Items:** ' . $itemsCount)
                    ->line('**Total Amount:** $' . $totalAmount)
                    ->action('View Order Details', route('vendor.orders.show', $this->order->id))
                    ->line('Please process this order as soon as possible.');
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
            'items_count' => $this->vendorItems->count(),
            'total_cents' => $this->vendorTotal,
            'customer_name' => $this->order->user->name,
            'created_at' => $this->order->created_at->toISOString(),
        ];
    }
}
