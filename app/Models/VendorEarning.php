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
     * Get the amount in dollars.
     *
     * @return float
     */
    public function getAmountInDollarsAttribute()
    {
        return $this->amount_cents / 100;
    }

    /**
     * Get the commission in dollars.
     *
     * @return float
     */
    public function getCommissionInDollarsAttribute()
    {
        return $this->commission_cents / 100;
    }

    /**
     * Get the net amount in dollars.
     *
     * @return float
     */
    public function getNetAmountInDollarsAttribute()
    {
        return $this->net_amount_cents / 100;
    }

    /**
     * Get the vendor that owns the earning.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the order that owns the earning.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}