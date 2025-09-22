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
        'rate' => 'float',
        'processed_at' => 'datetime',
    ];

    /**
     * Get the amount in dollars.
     *
     * @return float
     */
    public function getAmountInDollarsAttribute()
    {
        return $this->amount_cents / 100;
    }

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
}