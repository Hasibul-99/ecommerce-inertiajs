<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    protected $fillable = [
        'email',
        'ip',
        'successful',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'successful' => 'boolean',
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];
}
