<?php

namespace App\Notifications;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayoutCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $payout;

    public function __construct(Payout $payout)
    {
        $this->payout = $payout;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $amount = number_format($this->payout->net_amount_cents / 100, 2);

        return (new MailMessage)
            ->subject('Payout Completed - ' . $this->payout->payout_id)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Good news! Your payout has been completed.')
            ->line('**Payout ID:** ' . $this->payout->payout_id)
            ->line('**Amount:** $' . $amount)
            ->line('**Method:** ' . ucfirst(str_replace('_', ' ', $this->payout->payout_method)))
            ->line('The funds should arrive in your account within 1-3 business days.')
            ->action('View Payout Details', route('vendor.earnings.payout-details', $this->payout->id))
            ->line('Thank you for your business!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payout_id' => $this->payout->id,
            'payout_number' => $this->payout->payout_id,
            'amount_cents' => $this->payout->net_amount_cents,
            'status' => $this->payout->status,
            'message' => 'Your payout has been completed',
        ];
    }
}
