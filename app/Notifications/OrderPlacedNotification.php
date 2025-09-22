<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    protected $order;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject('Your Order #' . $this->order->order_number . ' has been placed')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Thank you for your order. We have received your order and it is now being processed.')
            ->line('Order #: ' . $this->order->order_number);

        // Add payment method specific information
        if ($this->order->payment_method === 'cod') {
            $mailMessage->line('Payment Method: Cash on Delivery')
                ->line('Payment Status: Unpaid - You will pay when your order is delivered.');
        } else {
            $mailMessage->line('Payment Method: ' . ucfirst($this->order->payment_method))
                ->line('Payment Status: ' . ucfirst($this->order->payment_status));
        }

        // Add order details
        $mailMessage->line('Order Total: $' . number_format($this->order->total_cents / 100, 2))
            ->action('View Order Details', url('/orders/' . $this->order->id))
            ->line('Thank you for shopping with us!');

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'total' => $this->order->total_cents / 100,
            'payment_method' => $this->order->payment_method,
            'payment_status' => $this->order->payment_status,
        ];
    }
}