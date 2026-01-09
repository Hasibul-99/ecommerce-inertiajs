<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_item_id',
        'vendor_id',
        'rate',
        'amount_cents',
        'status',
        'processed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rate' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    /**
     * Get the order item that owns the commission.
     */
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    /**
     * Get the vendor that owns the commission.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the amount in dollars.
     */
    public function getAmountInDollarsAttribute(): float
    {
        return $this->amount_cents / 100;
    }

    /**
     * Scope a query to only include pending commissions.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include processed commissions.
     */
    public function scopeProcessed($query)
    {
        return $query->where('status', 'processed');
    }
}
