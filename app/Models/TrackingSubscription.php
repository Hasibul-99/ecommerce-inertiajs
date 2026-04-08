<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrackingSubscription extends Model
{
    protected $fillable = [
        'order_id',
        'email',
        'phone',
        'email_enabled',
        'sms_enabled',
        'unsubscribe_token',
    ];

    protected $casts = [
        'email_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
    ];

    /**
     * Get the order that owns the subscription.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Check if email notifications are enabled.
     */
    public function hasEmailEnabled(): bool
    {
        return $this->email_enabled;
    }

    /**
     * Check if SMS notifications are enabled.
     */
    public function hasSmsEnabled(): bool
    {
        return $this->sms_enabled && !empty($this->phone);
    }

    /**
     * Unsubscribe from all notifications.
     */
    public function unsubscribeAll(): void
    {
        $this->update([
            'email_enabled' => false,
            'sms_enabled' => false,
        ]);
    }

    /**
     * Find subscription by unsubscribe token.
     */
    public static function findByUnsubscribeToken(string $token): ?self
    {
        return static::where('unsubscribe_token', $token)->first();
    }
}
