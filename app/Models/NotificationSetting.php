<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notification_type',
        'email_enabled',
        'push_enabled',
    ];

    protected $casts = [
        'email_enabled' => 'boolean',
        'push_enabled' => 'boolean',
    ];

    /**
     * Get the user that owns the notification setting.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a channel is enabled for this notification type.
     */
    public function isChannelEnabled(string $channel): bool
    {
        return match ($channel) {
            'mail' => $this->email_enabled,
            'database', 'broadcast' => $this->push_enabled,
            default => false,
        };
    }

    /**
     * Get or create notification settings for a user.
     */
    public static function getOrCreateForUser(int $userId, string $notificationType): self
    {
        return static::firstOrCreate(
            [
                'user_id' => $userId,
                'notification_type' => $notificationType,
            ],
            [
                'email_enabled' => true,
                'push_enabled' => true,
            ]
        );
    }
}
