<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockedIp extends Model
{
    protected $fillable = [
        'ip',
        'reason',
        'blocked_until',
        'created_by',
    ];

    protected $casts = [
        'blocked_until' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isActive(): bool
    {
        if ($this->blocked_until === null) {
            return true; // Permanent block
        }

        return $this->blocked_until->isFuture();
    }
}
