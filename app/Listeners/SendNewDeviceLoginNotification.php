<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\NewDeviceLogin;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendNewDeviceLoginNotification implements ShouldQueue
{
    public $queue = 'notifications';

    /**
     * Handle the event.
     */
    public function handle(NewDeviceLogin $event): void
    {
        // Log the new device login
        Log::info('New device login detected', [
            'user_id' => $event->user->id,
            'user_email' => $event->user->email,
            'device' => $event->device,
            'location' => $event->location,
            'ip' => $event->loginAttempt->ip,
        ]);

        // Notify the user about the new device login
        $event->user->notify(new \App\Notifications\NewDeviceLoginNotification(
            $event->loginAttempt,
            $event->device,
            $event->location
        ));
    }

    /**
     * Handle a job failure.
     */
    public function failed(NewDeviceLogin $event, \Throwable $exception): void
    {
        Log::error('Failed to send new device login notification', [
            'user_id' => $event->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
