<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SuspiciousActivityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private User $suspiciousUser,
        private string $activityType,
        private array $details
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
        return (new MailMessage)
            ->subject('Suspicious Activity Detected')
            ->greeting("Hello {$notifiable->name},")
            ->line('Suspicious activity has been detected on the platform.')
            ->line("**User:** {$this->suspiciousUser->name} ({$this->suspiciousUser->email})")
            ->line("**Activity Type:** {$this->activityType}")
            ->line("**IP Address:** {$this->details['ip'] ?? 'Unknown'}")
            ->action('View Security Logs', route('admin.security.logs'))
            ->line('Please review this activity and take appropriate action if necessary.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'user_id' => $this->suspiciousUser->id,
            'user_name' => $this->suspiciousUser->name,
            'user_email' => $this->suspiciousUser->email,
            'activity_type' => $this->activityType,
            'details' => $this->details,
            'message' => "Suspicious activity detected: {$this->activityType} by {$this->suspiciousUser->email}",
        ];
    }
}
