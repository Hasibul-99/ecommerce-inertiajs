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
        'slug',
        'description',
        'base_price_cents',
        'currency',
        'status',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
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
        return $this->belongsToMany(ProductTag::class, 'product_tag');
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
}