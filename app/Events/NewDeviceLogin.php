<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\LoginAttempt;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewDeviceLogin
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly LoginAttempt $loginAttempt,
        public readonly string $device,
        public readonly string $location
    ) {}
}
