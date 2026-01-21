<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\AccountLocked;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendAccountLockedNotification implements ShouldQueue
{
    public $queue = 'notifications';

    /**
     * Handle the event.
     */
    public function handle(AccountLocked $event): void
    {
        // Log the account lock
        Log::warning('Account locked due to failed login attempts', [
            'user_id' => $event->user->id,
            'user_email' => $event->user->email,
            'reason' => $event->reason,
            'failed_attempts' => $event->failedAttempts,
            'locked_until' => $event->accountLock->locked_until,
        ]);

        // Notify the user about the account lock
        $event->user->notify(new \App\Notifications\AccountLockedNotification(
            $event->accountLock,
            $event->reason,
            $event->failedAttempts
        ));
    }

    /**
     * Handle a job failure.
     */
    public function failed(AccountLocked $event, \Throwable $exception): void
    {
        Log::error('Failed to send account locked notification', [
            'user_id' => $event->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
