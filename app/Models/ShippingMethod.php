<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'carrier',
        'type',
        'estimated_days_min',
        'estimated_days_max',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estimated_days_min' => 'integer',
        'estimated_days_max' => 'integer',
    ];

    /**
     * Get the shipping rates for this method.
     */
    public function shippingRates()
    {
        return $this->hasMany(ShippingRate::class);
    }

    /**
     * Get the vendors using this shipping method.
     */
    public function vendors()
    {
        return $this->belongsToMany(Vendor::class, 'vendor_shipping_methods')
            ->withPivot('is_enabled', 'custom_rate_cents', 'handling_time_days')
            ->withTimestamps();
    }

    /**
     * Get vendor shipping method configurations.
     */
    public function vendorShippingMethods()
    {
        return $this->hasMany(VendorShippingMethod::class);
    }

    /**
     * Scope active methods.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get formatted estimated delivery.
     */
    public function getEstimatedDeliveryAttribute(): string
    {
        if ($this->estimated_days_min === $this->estimated_days_max) {
            return $this->estimated_days_min . ' day' . ($this->estimated_days_min > 1 ? 's' : '');
        }

        return $this->estimated_days_min . '-' . $this->estimated_days_max . ' days';
    }
}
