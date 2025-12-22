<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The order instance.
     *
     * @var \App\Models\Order
     */
    protected $order;

    /**
     * The failure reason.
     *
     * @var string|null
     */
    protected $reason;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Order  $order
     * @param  string|null  $reason
     * @return void
     */
    public function __construct(Order $order, ?string $reason = null)
    {
        $this->order = $order;
        $this->reason = $reason;
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
            ->subject('Payment Failed for Order #' . $this->order->order_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('We were unable to process the payment for your order.')
            ->line('Order #: ' . $this->order->order_number)
            ->line('Order Total: $' . number_format($this->order->total_cents / 100, 2));

        if ($this->reason) {
            $mailMessage->line('Reason: ' . $this->reason);
        }

        $mailMessage->line('Please update your payment method to complete your order.')
            ->action('Update Payment Method', url('/orders/' . $this->order->id . '/payment'))
            ->line('If you need assistance, please contact our support team.');

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
            'reason' => $this->reason,
        ];
    }
}
