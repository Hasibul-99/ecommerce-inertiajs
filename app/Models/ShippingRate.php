<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'shipping_zone_id',
        'shipping_method_id',
        'min_weight',
        'max_weight',
        'min_order_cents',
        'max_order_cents',
        'rate_cents',
        'free_shipping_threshold_cents',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'min_weight' => 'integer',
        'max_weight' => 'integer',
        'min_order_cents' => 'integer',
        'max_order_cents' => 'integer',
        'rate_cents' => 'integer',
        'free_shipping_threshold_cents' => 'integer',
    ];

    /**
     * Get the shipping zone for this rate.
     */
    public function shippingZone()
    {
        return $this->belongsTo(ShippingZone::class);
    }

    /**
     * Get the shipping method for this rate.
     */
    public function shippingMethod()
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * Check if the weight matches this rate.
     */
    public function matchesWeight(int $weight): bool
    {
        if ($weight < $this->min_weight) {
            return false;
        }

        if ($this->max_weight && $weight > $this->max_weight) {
            return false;
        }

        return true;
    }

    /**
     * Check if the order total matches this rate.
     */
    public function matchesOrderTotal(int $totalCents): bool
    {
        if ($totalCents < $this->min_order_cents) {
            return false;
        }

        if ($this->max_order_cents && $totalCents > $this->max_order_cents) {
            return false;
        }

        return true;
    }
}
