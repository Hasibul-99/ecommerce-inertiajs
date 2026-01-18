<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'is_default',
        'is_public',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user that owns the wishlist.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the wishlist.
     */
    public function items()
    {
        return $this->hasMany(WishlistItem::class);
    }

    /**
     * Get the products in the wishlist.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'wishlist_items')
            ->withTimestamps();
    }

    /**
     * Get the item count for a specific user.
     *
     * @param int $userId
     * @return int
     */
    public static function getItemCountForUser(int $userId): int
    {
        $wishlist = static::where('user_id', $userId)->first();
        return $wishlist ? $wishlist->items()->count() : 0;
    }
}