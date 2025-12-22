<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderShippedNotification extends Notification implements ShouldQueue
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
            ->subject('Your Order #' . $this->order->order_number . ' has been shipped')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! Your order has been shipped and is on its way to you.');

        if ($this->order->tracking_number) {
            $mailMessage->line('Tracking Number: ' . $this->order->tracking_number);
        }

        if ($this->order->shipping_carrier) {
            $mailMessage->line('Carrier: ' . ucfirst($this->order->shipping_carrier));
        }

        $mailMessage->line('Order #: ' . $this->order->order_number)
            ->line('Order Total: $' . number_format($this->order->total_cents / 100, 2))
            ->action('Track Your Order', url('/orders/' . $this->order->id))
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
            'tracking_number' => $this->order->tracking_number,
            'shipping_carrier' => $this->order->shipping_carrier,
        ];
    }
}
