<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'countries',
        'states',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'countries' => 'array',
        'states' => 'array',
    ];

    /**
     * Get the shipping rates for this zone.
     */
    public function shippingRates()
    {
        return $this->hasMany(ShippingRate::class);
    }

    /**
     * Scope active zones.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Check if a country is in this zone.
     */
    public function hasCountry(string $countryCode): bool
    {
        return in_array($countryCode, $this->countries ?? []);
    }

    /**
     * Check if a state is in this zone.
     */
    public function hasState(string $countryCode, string $stateCode): bool
    {
        $states = $this->states ?? [];

        return isset($states[$countryCode]) && in_array($stateCode, $states[$countryCode]);
    }
}
