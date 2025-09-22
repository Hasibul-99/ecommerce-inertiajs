<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vendor_id',
        'payout_id',
        'amount_cents',
        'status',
        'payment_method',
        'payout_details',
        'processed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'payout_details' => 'json',
        'processed_at' => 'datetime',
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
     * Get the vendor that owns the payout.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}