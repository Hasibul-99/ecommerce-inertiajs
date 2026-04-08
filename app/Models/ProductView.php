<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductView extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the product that was viewed.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who viewed the product.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
