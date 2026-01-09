<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vendor_id',
        'payout_id',
        'period_start',
        'period_end',
        'items_count',
        'amount_cents',
        'processing_fee_cents',
        'net_amount_cents',
        'status',
        'payment_method',
        'payout_method',
        'payout_details',
        'processed_at',
        'cancellation_reason',
        'cancelled_at',
        'requested_by',
        'processed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'payout_details' => 'json',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
        'processed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Get the amount in dollars.
     */
    public function getAmountInDollarsAttribute(): float
    {
        return $this->amount_cents / 100;
    }

    /**
     * Get the processing fee in dollars.
     */
    public function getProcessingFeeInDollarsAttribute(): float
    {
        return $this->processing_fee_cents / 100;
    }

    /**
     * Get the net amount in dollars.
     */
    public function getNetAmountInDollarsAttribute(): float
    {
        return $this->net_amount_cents / 100;
    }

    /**
     * Get the vendor that owns the payout.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the user who requested the payout.
     */
    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the user who processed the payout.
     */
    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Scope a query to only include pending payouts.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include processing payouts.
     */
    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    /**
     * Scope a query to only include completed payouts.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include failed payouts.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope a query to only include cancelled payouts.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Check if payout can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'failed']);
    }

    /**
     * Check if payout can be processed.
     */
    public function canBeProcessed(): bool
    {
        return $this->status === 'pending';
    }
}