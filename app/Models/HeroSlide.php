<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class HeroSlide extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'button_text',
        'button_link',
        'image_path',
        'order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['image_url'];

    /**
     * Get the hero slide image URL.
     *
     * @return string|null
     */
    public function getImageUrlAttribute(): ?string
    {
        if ($this->hasMedia('hero_images')) {
            return $this->getFirstMediaUrl('hero_images');
        }

        return $this->image_path ?? asset('images/placeholder-hero.jpg');
    }

    /**
     * Scope a query to only include active slides.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order slides by their order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Register the media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero_images')
            ->singleFile()
            ->useFallbackUrl(asset('images/placeholder-hero.jpg'))
            ->useFallbackPath(public_path('images/placeholder-hero.jpg'));
    }
}
