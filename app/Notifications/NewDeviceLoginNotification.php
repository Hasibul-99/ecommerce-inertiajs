<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\LoginAttempt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewDeviceLoginNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private LoginAttempt $loginAttempt,
        private string $device,
        private string $location
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
        $loginTime = $this->loginAttempt->created_at->format('M d, Y H:i:s');

        return (new MailMessage)
            ->subject('New Device Login Detected')
            ->greeting("Hello {$notifiable->name},")
            ->line('We detected a login to your account from a new device.')
            ->line("**Device:** {$this->device}")
            ->line("**Location:** {$this->location}")
            ->line("**IP Address:** {$this->loginAttempt->ip}")
            ->line("**Time:** {$loginTime}")
            ->line('If this was you, you can safely ignore this email.')
            ->line('If you did not authorize this login, please secure your account immediately.')
            ->action('Secure My Account', route('profile.edit'))
            ->line('Consider changing your password and reviewing your security settings.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'login_attempt_id' => $this->loginAttempt->id,
            'device' => $this->device,
            'location' => $this->location,
            'ip' => $this->loginAttempt->ip,
            'user_agent' => $this->loginAttempt->user_agent,
            'login_time' => $this->loginAttempt->created_at->toISOString(),
            'message' => "New login from {$this->device} in {$this->location}",
        ];
    }
}
