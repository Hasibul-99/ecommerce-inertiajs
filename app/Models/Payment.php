<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'order_id',
        'payment_id',
        'amount_cents',
        'currency',
        'payment_method',
        'status',
        'payment_details',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'payment_details' => 'json',
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
     * Get the user that owns the payment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order that owns the payment.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the refunds for the payment.
     */
    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }
}