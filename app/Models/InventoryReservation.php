<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryReservation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_variant_id',
        'cart_item_id',
        'order_item_id',
        'quantity',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Get the product variant that owns the reservation.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /**
     * Get the cart item that owns the reservation.
     */
    public function cartItem()
    {
        return $this->belongsTo(CartItem::class);
    }

    /**
     * Get the order item that owns the reservation.
     */
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }
}