<?php

namespace App\Notifications;

use App\Models\Payout;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayoutFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $payout;
    protected $reason;

    public function __construct(Payout $payout, string $reason)
    {
        $this->payout = $payout;
        $this->reason = $reason;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $amount = number_format($this->payout->amount_cents / 100, 2);

        return (new MailMessage)
            ->subject('Payout Failed - ' . $this->payout->payout_id)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Unfortunately, your recent payout request has failed.')
            ->line('**Payout ID:** ' . $this->payout->payout_id)
            ->line('**Amount:** $' . $amount)
            ->line('**Reason:** ' . $this->reason)
            ->line('The funds have been returned to your available balance.')
            ->action('View Payout Details', route('vendor.earnings.payout-details', $this->payout->id))
            ->line('Please update your bank details or contact support if you need assistance.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payout_id' => $this->payout->id,
            'payout_number' => $this->payout->payout_id,
            'amount_cents' => $this->payout->amount_cents,
            'status' => $this->payout->status,
            'reason' => $this->reason,
            'message' => 'Your payout request has failed',
        ];
    }
}
