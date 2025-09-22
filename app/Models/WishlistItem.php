<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishlistItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'wishlist_id',
        'product_id',
        'product_variant_id',
        'notes',
    ];

    /**
     * Get the wishlist that owns the item.
     */
    public function wishlist()
    {
        return $this->belongsTo(Wishlist::class);
    }

    /**
     * Get the product that owns the item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the product variant that owns the item.
     */
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}