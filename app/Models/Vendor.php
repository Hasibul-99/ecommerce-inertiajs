<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Vendor extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'description',
        'phone',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postal_code',
        'country',
        'tax_id',
        'business_type',
        'website',
        'status',
        'onboarding_step',
        'commission_percent',
        'commission_rate',
        'stripe_account_id',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'bank_routing_number',
        'bank_swift_code',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejected_by',
        'rejection_reason',
        'kyc',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'meta' => 'json',
        'kyc' => 'json',
        'commission_percent' => 'float',
        'commission_rate' => 'decimal:2',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'bank_account_number',
        'bank_routing_number',
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

    /**
     * Get the documents for the vendor.
     */
    public function documents()
    {
        return $this->hasMany(VendorDocument::class);
    }

    /**
     * Get the settings for the vendor.
     */
    public function settings()
    {
        return $this->hasMany(VendorSetting::class);
    }

    /**
     * Get the user who approved the vendor.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the user who rejected the vendor.
     */
    public function rejecter()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    /**
     * Register media collections for the model.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')
            ->singleFile()
            ->useDisk('public')
            ->registerMediaConversions(function () {
                $this->addMediaConversion('thumb')
                    ->width(200)
                    ->height(200);
            });

        $this->addMediaCollection('banner')
            ->singleFile()
            ->useDisk('public')
            ->registerMediaConversions(function () {
                $this->addMediaConversion('large')
                    ->width(1200)
                    ->height(400);
            });
    }

    /**
     * Scope a query to only include pending vendors.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved vendors.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected vendors.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Check if vendor is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if vendor is pending approval.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Get a setting value.
     */
    public function getSetting(string $key, $default = null)
    {
        return VendorSetting::get($this, $key, $default);
    }

    /**
     * Set a setting value.
     */
    public function setSetting(string $key, $value): VendorSetting
    {
        return VendorSetting::set($this, $key, $value);
    }
}