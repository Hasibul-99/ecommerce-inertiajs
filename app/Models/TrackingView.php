<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrackingView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'ip_address',
        'user_agent',
        'tracking_token',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    /**
     * Get the order that was viewed.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Record a new tracking view.
     */
    public static function record(int $orderId, ?string $token = null): void
    {
        static::create([
            'order_id' => $orderId,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tracking_token' => $token,
            'viewed_at' => now(),
        ]);
    }

    /**
     * Get view count for an order.
     */
    public static function getViewCount(int $orderId): int
    {
        return static::where('order_id', $orderId)->count();
    }

    /**
     * Get most viewed orders.
     */
    public static function getMostViewed(int $limit = 10): array
    {
        return static::selectRaw('order_id, COUNT(*) as view_count')
            ->groupBy('order_id')
            ->orderByDesc('view_count')
            ->limit($limit)
            ->get()
            ->pluck('view_count', 'order_id')
            ->toArray();
    }
}
