<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderRefund extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'user_id',
        'amount_cents',
        'reason',
        'status',
        'notes',
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
     * Get the order that owns the refund.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user that owns the refund.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}