<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, Searchable, InteractsWithMedia, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vendor_id',
        'category_id',
        'title',
        'name',
        'slug',
        'sku',
        'description',
        'attributes',
        'base_price_cents',
        'price_cents',
        'sale_price_cents',
        'compare_at_price_cents',
        'cost_cents',
        'currency',
        'stock_quantity',
        'average_rating',
        'reviews_count',
        'sales_count',
        'status',
        'is_active',
        'is_featured',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'attributes' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'average_rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'sales_count' => 'integer',
        'stock_quantity' => 'integer',
        'published_at' => 'datetime',
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
     * Get the vendor that owns the product.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the variants for the product.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get the categories for the product.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Get the tags for the product.
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
    
    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();
        
        // Include the vendor name in the searchable array
        $array['vendor_name'] = $this->vendor ? $this->vendor->name : null;
        
        // Include the category name in the searchable array
        $array['category_name'] = $this->category ? $this->category->name : null;
        
        // Only include the fields we want to search
        return [
            'id' => $array['id'],
            'title' => $array['title'],
            'description' => $array['description'],
            'vendor_name' => $array['vendor_name'],
            'category_name' => $array['category_name'],
        ];
    }
    
    /**
     * Register media collections for the model.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public')
            ->registerMediaConversions(function () {
                $this->addMediaConversion('thumb')
                    ->width(200)
                    ->height(200);
                    
                $this->addMediaConversion('medium')
                    ->width(800)
                    ->height(800);
            });
    }

    /**
     * Get the attributes for the product.
     */
    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

    /**
     * Get the images for the product.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get the reviews for the product.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the average rating for the product.
     */
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->approved()->avg('rating') ?? 0;
    }

    /**
     * Get the total reviews count for the product.
     */
    public function getReviewsCountAttribute()
    {
        return $this->reviews()->approved()->count();
    }
}