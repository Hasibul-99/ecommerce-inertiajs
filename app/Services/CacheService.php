<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    // Cache key prefixes
    public const PREFIX_CATEGORY = 'category';
    public const PREFIX_PRODUCT = 'product';
    public const PREFIX_VENDOR = 'vendor';
    public const PREFIX_SETTINGS = 'settings';
    public const PREFIX_HOMEPAGE = 'homepage';
    public const PREFIX_STATS = 'stats';

    // Cache TTL (in seconds)
    public const TTL_FOREVER = null; // Never expires
    public const TTL_LONG = 86400; // 24 hours
    public const TTL_MEDIUM = 3600; // 1 hour
    public const TTL_SHORT = 300; // 5 minutes
    public const TTL_VERY_SHORT = 60; // 1 minute

    /**
     * Get cached data or execute callback and cache result.
     */
    public function remember(string $key, $ttl, callable $callback): mixed
    {
        try {
            if ($ttl === self::TTL_FOREVER) {
                return Cache::rememberForever($key, $callback);
            }

            return Cache::remember($key, $ttl, $callback);
        } catch (\Exception $e) {
            Log::error('Cache remember failed', [
                'key' => $key,
                'error' => $e->getMessage(),
            ]);

            // Return callback result if caching fails
            return $callback();
        }
    }

    /**
     * Get cached data.
     */
    public function get(string $key, mixed $default = null): mixed
    {
        return Cache::get($key, $default);
    }

    /**
     * Store data in cache.
     */
    public function put(string $key, mixed $value, $ttl = self::TTL_MEDIUM): bool
    {
        try {
            if ($ttl === self::TTL_FOREVER) {
                return Cache::forever($key, $value);
            }

            return Cache::put($key, $value, $ttl);
        } catch (\Exception $e) {
            Log::error('Cache put failed', [
                'key' => $key,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Delete cached data.
     */
    public function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    /**
     * Flush all cache by tags.
     */
    public function flushByTags(array $tags): bool
    {
        try {
            Cache::tags($tags)->flush();
            return true;
        } catch (\Exception $e) {
            Log::error('Cache flush by tags failed', [
                'tags' => $tags,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Cache categories tree.
     */
    public function cacheCategories(callable $callback): mixed
    {
        return $this->remember(
            $this->categoryKey('tree'),
            self::TTL_FOREVER,
            $callback
        );
    }

    /**
     * Clear categories cache.
     */
    public function clearCategoriesCache(): void
    {
        $this->forget($this->categoryKey('tree'));
        $this->forget($this->categoryKey('all'));
        $this->forget($this->categoryKey('with_counts'));
    }

    /**
     * Clear specific category cache.
     */
    public function clearCategoryCache(int $categoryId): void
    {
        $this->forget($this->categoryKey($categoryId));
        $this->forget($this->categoryKey('tree'));
        $this->forget($this->categoryKey('with_counts'));
    }

    /**
     * Cache product data.
     */
    public function cacheProduct(int $productId, callable $callback, int $ttl = self::TTL_LONG): mixed
    {
        return $this->remember(
            $this->productKey($productId),
            $ttl,
            $callback
        );
    }

    /**
     * Clear product cache.
     */
    public function clearProductCache(int $productId): void
    {
        $this->forget($this->productKey($productId));
        $this->forget($this->productKey($productId, 'full'));
        $this->clearHomepageCache(); // Homepage might display this product
    }

    /**
     * Cache homepage data.
     */
    public function cacheHomepage(string $section, callable $callback, int $ttl = self::TTL_MEDIUM): mixed
    {
        return $this->remember(
            $this->homepageKey($section),
            $ttl,
            $callback
        );
    }

    /**
     * Clear homepage cache.
     */
    public function clearHomepageCache(): void
    {
        $this->forget($this->homepageKey('featured_products'));
        $this->forget($this->homepageKey('deal_products'));
        $this->forget($this->homepageKey('new_products'));
        $this->forget($this->homepageKey('popular_categories'));
    }

    /**
     * Cache vendor stats.
     */
    public function cacheVendorStats(int $vendorId, callable $callback, int $ttl = self::TTL_SHORT): mixed
    {
        return $this->remember(
            $this->vendorKey($vendorId, 'stats'),
            $ttl,
            $callback
        );
    }

    /**
     * Clear vendor cache.
     */
    public function clearVendorCache(int $vendorId): void
    {
        $this->forget($this->vendorKey($vendorId));
        $this->forget($this->vendorKey($vendorId, 'stats'));
        $this->forget($this->vendorKey($vendorId, 'products'));
    }

    /**
     * Warm up cache with frequently accessed data.
     */
    public function warmUp(): void
    {
        Log::info('Starting cache warmup');

        // This will be called by artisan command
        // Implement specific warmup logic per feature
    }

    /**
     * Generate category cache key.
     */
    private function categoryKey(string|int $identifier): string
    {
        return sprintf('%s:%s', self::PREFIX_CATEGORY, $identifier);
    }

    /**
     * Generate product cache key.
     */
    private function productKey(int $productId, string $suffix = ''): string
    {
        $key = sprintf('%s:%d', self::PREFIX_PRODUCT, $productId);
        return $suffix ? "{$key}:{$suffix}" : $key;
    }

    /**
     * Generate vendor cache key.
     */
    private function vendorKey(int $vendorId, string $suffix = ''): string
    {
        $key = sprintf('%s:%d', self::PREFIX_VENDOR, $vendorId);
        return $suffix ? "{$key}:{$suffix}" : $key;
    }

    /**
     * Generate homepage cache key.
     */
    private function homepageKey(string $section): string
    {
        return sprintf('%s:%s', self::PREFIX_HOMEPAGE, $section);
    }

    /**
     * Generate stats cache key.
     */
    private function statsKey(string $type, string $identifier): string
    {
        return sprintf('%s:%s:%s', self::PREFIX_STATS, $type, $identifier);
    }
}
