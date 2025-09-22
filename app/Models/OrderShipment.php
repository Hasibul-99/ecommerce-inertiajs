<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderShipment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'tracking_number',
        'shipping_carrier',
        'shipping_method',
        'shipping_cost_cents',
        'status',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Get the shipping cost in dollars.
     *
     * @return float
     */
    public function getShippingCostInDollarsAttribute()
    {
        return $this->shipping_cost_cents / 100;
    }

    /**
     * Get the order that owns the shipment.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}