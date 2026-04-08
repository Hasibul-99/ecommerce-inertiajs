<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'is_default',
        'type',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the address.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the full address as string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = [
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ];

        return implode(', ', array_filter($parts));
    }

    /**
     * Get the street address (combining line 1 and 2).
     */
    public function getStreetAttribute(): string
    {
        return $this->address_line_2
            ? "{$this->address_line_1}, {$this->address_line_2}"
            : $this->address_line_1;
    }

    /**
     * Scope to get default address for a user.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to get shipping addresses.
     */
    public function scopeShipping($query)
    {
        return $query->whereIn('type', ['shipping', 'both']);
    }

    /**
     * Scope to get billing addresses.
     */
    public function scopeBilling($query)
    {
        return $query->whereIn('type', ['billing', 'both']);
    }
}
