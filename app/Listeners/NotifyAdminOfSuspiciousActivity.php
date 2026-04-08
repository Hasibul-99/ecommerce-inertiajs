<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\SuspiciousActivityDetected;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class NotifyAdminOfSuspiciousActivity implements ShouldQueue
{
    public $queue = 'notifications';

    /**
     * Handle the event.
     */
    public function handle(SuspiciousActivityDetected $event): void
    {
        // Log the suspicious activity
        Log::warning('Suspicious activity detected', [
            'user_id' => $event->user->id,
            'user_email' => $event->user->email,
            'activity_type' => $event->activityType,
            'details' => $event->details,
            'security_event_id' => $event->securityEvent->id,
        ]);

        // Notify all admins
        $admins = User::role(['admin', 'super-admin'])->get();

        foreach ($admins as $admin) {
            // Create database notification for admin
            $admin->notify(new \App\Notifications\SuspiciousActivityNotification(
                $event->user,
                $event->activityType,
                $event->details
            ));
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(SuspiciousActivityDetected $event, \Throwable $exception): void
    {
        Log::error('Failed to notify admin of suspicious activity', [
            'user_id' => $event->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
