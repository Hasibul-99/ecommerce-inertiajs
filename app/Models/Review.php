<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'order_item_id',
        'rating',
        'title',
        'comment',
        'pros',
        'cons',
        'is_verified_purchase',
        'is_approved',
        'helpful_count',
        'reported_count',
        'vendor_response',
        'vendor_response_at',
        'vendor_response_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'rating' => 'integer',
        'helpful_count' => 'integer',
        'reported_count' => 'integer',
        'vendor_response_at' => 'datetime',
    ];

    /**
     * Get the product that the review belongs to.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user that wrote the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order item associated with the review.
     */
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    /**
     * Get the images for the review.
     */
    public function images()
    {
        return $this->hasMany(ReviewImage::class);
    }

    /**
     * Get the user who responded as vendor.
     */
    public function vendorResponder()
    {
        return $this->belongsTo(User::class, 'vendor_response_by');
    }

    /**
     * Get users who marked this review as helpful.
     */
    public function helpfulVotes()
    {
        return $this->belongsToMany(User::class, 'review_helpful_votes')->withTimestamps();
    }

    /**
     * Get reports for this review.
     */
    public function reports()
    {
        return $this->hasMany(ReviewReport::class);
    }

    /**
     * Scope a query to only include approved reviews.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope a query to only include verified purchases.
     */
    public function scopeVerifiedPurchase($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    /**
     * Scope a query to filter by rating.
     */
    public function scopeRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }
}
