<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'sku',
        'attributes',
        'price_cents',
        'stock_quantity',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'attributes' => 'json',
    ];

    /**
     * Get the price in dollars.
     *
     * @return float
     */
    public function getPriceInDollarsAttribute()
    {
        return $this->price_cents / 100;
    }

    /**
     * Get the compare at price in dollars.
     *
     * @return float|null
     */
    public function getCompareAtPriceInDollarsAttribute()
    {
        return $this->compare_at_price_cents ? $this->compare_at_price_cents / 100 : null;
    }

    /**
     * Get the cost in dollars.
     *
     * @return float|null
     */
    public function getCostInDollarsAttribute()
    {
        return $this->cost_cents ? $this->cost_cents / 100 : null;
    }

    /**
     * Get the product that owns the variant.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the cart items for the product variant.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the order items for the product variant.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the inventory reservations for the product variant.
     */
    public function inventoryReservations()
    {
        return $this->hasMany(InventoryReservation::class);
    }

    /**
     * Get the wishlist items for the product variant.
     */
    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }
}