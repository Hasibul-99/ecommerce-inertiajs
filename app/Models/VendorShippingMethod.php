<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorShippingMethod extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vendor_id',
        'shipping_method_id',
        'is_enabled',
        'custom_rate_cents',
        'handling_time_days',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
        'custom_rate_cents' => 'integer',
        'handling_time_days' => 'integer',
    ];

    /**
     * Get the vendor for this configuration.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the shipping method for this configuration.
     */
    public function shippingMethod()
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * Scope enabled methods.
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }
}
