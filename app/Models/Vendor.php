<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'phone',
        'status',
        'commission_percent',
        'stripe_account_id',
        'kyc',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'meta' => 'json',
        'commission_rate' => 'float',
    ];

    /**
     * Get the user that owns the vendor.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the products for the vendor.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the commissions for the vendor.
     */
    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }

    /**
     * Get the earnings for the vendor.
     */
    public function earnings()
    {
        return $this->hasMany(VendorEarning::class);
    }

    /**
     * Get the payouts for the vendor.
     */
    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }
}