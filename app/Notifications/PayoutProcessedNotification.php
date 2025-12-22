<?php

namespace App\Notifications;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayoutProcessedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The payout instance.
     *
     * @var \App\Models\Payout
     */
    protected $payout;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Payout  $payout
     * @return void
     */
    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
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
        return (new MailMessage)
            ->subject('Payout Processed: ' . $this->payout->reference_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your payout has been successfully processed.')
            ->line('Reference Number: ' . $this->payout->reference_number)
            ->line('Payout Amount: $' . number_format($this->payout->amount_cents / 100, 2))
            ->line('Payment Method: ' . ucfirst($this->payout->payment_method ?? 'Bank Transfer'))
            ->line('The funds should arrive in your account within 3-5 business days.')
            ->action('View Payout Details', url('/vendor/payouts/' . $this->payout->id))
            ->line('Thank you for being a valued vendor!');
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
            'payout_id' => $this->payout->id,
            'reference_number' => $this->payout->reference_number,
            'amount_cents' => $this->payout->amount_cents,
            'processed_at' => now()->toISOString(),
        ];
    }
}
