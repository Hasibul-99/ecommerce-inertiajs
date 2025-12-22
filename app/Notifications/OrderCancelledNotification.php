<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCancelledNotification extends Notification implements ShouldQueue
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
            ->subject('Your Order #' . $this->order->order_number . ' has been cancelled')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your order has been cancelled as requested.')
            ->line('Order #: ' . $this->order->order_number);

        if ($this->order->payment_status === 'paid') {
            $mailMessage->line('Refund Amount: $' . number_format($this->order->total_cents / 100, 2))
                ->line('Your refund will be processed within 5-7 business days to your original payment method.');
        }

        $mailMessage->action('View Order Details', url('/orders/' . $this->order->id))
            ->line('If you have any questions, please contact our support team.');

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
            'cancelled_at' => now()->toISOString(),
        ];
    }
}
