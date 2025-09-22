<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payment_id',
        'refund_id',
        'amount_cents',
        'status',
        'reason',
        'refund_details',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'refund_details' => 'json',
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
     * Get the payment that owns the refund.
     */
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}