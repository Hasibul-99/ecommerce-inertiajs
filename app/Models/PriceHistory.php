<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'old_price_cents',
        'new_price_cents',
        'changed_by',
        'reason',
    ];

    /**
     * Get the product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who changed the price.
     */
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Get the price change amount in cents.
     */
    public function getChangeAmountCentsAttribute(): int
    {
        return $this->new_price_cents - $this->old_price_cents;
    }

    /**
     * Get the price change percentage.
     */
    public function getChangePercentageAttribute(): float
    {
        if ($this->old_price_cents == 0) {
            return 0;
        }

        return (($this->new_price_cents - $this->old_price_cents) / $this->old_price_cents) * 100;
    }
}
