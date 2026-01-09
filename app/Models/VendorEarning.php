<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorEarning extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vendor_id',
        'order_id',
        'amount_cents',
        'commission_cents',
        'net_amount_cents',
        'status',
        'available_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'available_at' => 'datetime',
    ];

    /**
     * Get the vendor that owns the earning.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the order associated with the earning.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the amount in dollars.
     */
    public function getAmountInDollarsAttribute(): float
    {
        return $this->amount_cents / 100;
    }

    /**
     * Get the commission in dollars.
     */
    public function getCommissionInDollarsAttribute(): float
    {
        return $this->commission_cents / 100;
    }

    /**
     * Get the net amount in dollars.
     */
    public function getNetAmountInDollarsAttribute(): float
    {
        return $this->net_amount_cents / 100;
    }

    /**
     * Scope a query to only include available earnings.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')
            ->where('available_at', '<=', now());
    }

    /**
     * Scope a query to only include pending earnings.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include withheld earnings (refund reserve).
     */
    public function scopeWithheld($query)
    {
        return $query->where('status', 'withheld');
    }

    /**
     * Check if the earning is available for payout.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available' && $this->available_at <= now();
    }
}
