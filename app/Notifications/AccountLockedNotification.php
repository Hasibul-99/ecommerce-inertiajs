<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\AccountLock;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountLockedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private AccountLock $accountLock,
        private string $reason,
        private int $failedAttempts
    ) {
        $this->queue = 'notifications';
    }

    /**
     * Get the notification's delivery channels.
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
        $lockedUntil = $this->accountLock->locked_until->format('M d, Y H:i:s');

        return (new MailMessage)
            ->subject('Your Account Has Been Temporarily Locked')
            ->greeting("Hello {$notifiable->name},")
            ->line('Your account has been temporarily locked due to multiple failed login attempts.')
            ->line("**Failed Attempts:** {$this->failedAttempts}")
            ->line("**Locked Until:** {$lockedUntil}")
            ->line('If this wasn\'t you, please contact our support team immediately.')
            ->line('Your account will be automatically unlocked after the specified time.')
            ->action('Contact Support', config('app.url') . '/contact')
            ->line('For security reasons, please ensure you are using the correct password.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'account_lock_id' => $this->accountLock->id,
            'reason' => $this->reason,
            'failed_attempts' => $this->failedAttempts,
            'locked_until' => $this->accountLock->locked_until->toISOString(),
            'message' => "Your account has been locked until {$this->accountLock->locked_until->format('M d, Y H:i')}",
        ];
    }
}
