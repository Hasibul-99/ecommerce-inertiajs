<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_id',
        'subtotal_cents',
        'tax_cents',
        'discount_cents',
        'total_cents',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Get the subtotal in dollars.
     *
     * @return float
     */
    public function getSubtotalInDollarsAttribute()
    {
        return $this->subtotal_cents / 100;
    }

    /**
     * Get the tax in dollars.
     *
     * @return float
     */
    public function getTaxInDollarsAttribute()
    {
        return $this->tax_cents / 100;
    }

    /**
     * Get the discount in dollars.
     *
     * @return float
     */
    public function getDiscountInDollarsAttribute()
    {
        return $this->discount_cents / 100;
    }

    /**
     * Get the total in dollars.
     *
     * @return float
     */
    public function getTotalInDollarsAttribute()
    {
        return $this->total_cents / 100;
    }

    /**
     * Get the user that owns the cart.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the cart.
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the coupon for the cart.
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }
}