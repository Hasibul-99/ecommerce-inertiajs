<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'coupon_code',
        'description',
        'discount_type',
        'discount_value',
        'minimum_spend_cents',
        'maximum_discount_cents',
        'starts_at',
        'expires_at',
        'usage_limit',
        'usage_count',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the minimum spend in dollars.
     *
     * @return float|null
     */
    public function getMinimumSpendInDollarsAttribute()
    {
        return $this->minimum_spend_cents ? $this->minimum_spend_cents / 100 : null;
    }

    /**
     * Get the maximum discount in dollars.
     *
     * @return float|null
     */
    public function getMaximumDiscountInDollarsAttribute()
    {
        return $this->maximum_discount_cents ? $this->maximum_discount_cents / 100 : null;
    }

    /**
     * Get the carts that use this coupon.
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Get the orders that use this coupon.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}