<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountLock extends Model
{
    protected $fillable = [
        'user_id',
        'reason',
        'locked_until',
        'failed_attempts',
    ];

    protected $casts = [
        'locked_until' => 'datetime',
        'failed_attempts' => 'integer',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isActive(): bool
    {
        return $this->locked_until->isFuture();
    }
}
