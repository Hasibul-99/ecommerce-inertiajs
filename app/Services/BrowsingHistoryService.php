<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BrowsingHistoryService
{
    /**
     * Record a product view for a user.
     */
    public function recordView(User $user, Product $product): void
    {
        try {
            // Use browsing_history table if it exists, or use a simple cache-based approach
            DB::table('browsing_history')->updateOrInsert(
                [
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ],
                [
                    'viewed_at' => now(),
                    'updated_at' => now(),
                ]
            );

            Log::info('Product view recorded', [
                'user_id' => $user->id,
                'product_id' => $product->id,
            ]);
        } catch (\Exception $e) {
            // If browsing_history table doesn't exist, use cache
            $this->recordViewInCache($user, $product);
        }
    }

    /**
     * Get recently viewed products for a user.
     */
    public function getRecentlyViewed(User $user, int $limit = 10): Collection
    {
        try {
            $productIds = DB::table('browsing_history')
                ->where('user_id', $user->id)
                ->orderBy('viewed_at', 'desc')
                ->limit($limit)
                ->pluck('product_id');

            return Product::whereIn('id', $productIds)
                ->with(['media', 'variants'])
                ->get()
                ->sortBy(function ($product) use ($productIds) {
                    return $productIds->search($product->id);
                })
                ->values();
        } catch (\Exception $e) {
            // Fallback to cache
            return $this->getRecentlyViewedFromCache($user, $limit);
        }
    }

    /**
     * Clear browsing history for a user.
     */
    public function clearHistory(User $user): bool
    {
        try {
            DB::table('browsing_history')
                ->where('user_id', $user->id)
                ->delete();

            activity()
                ->causedBy($user)
                ->log('Browsing history cleared');

            return true;
        } catch (\Exception $e) {
            // Clear cache-based history
            return $this->clearHistoryFromCache($user);
        }
    }

    /**
     * Get recommended products based on browsing history.
     */
    public function getRecommendedProducts(User $user, int $limit = 6): Collection
    {
        // Get user's recently viewed products
        $recentlyViewed = $this->getRecentlyViewed($user, 20);

        if ($recentlyViewed->isEmpty()) {
            // Return popular products if no history
            return Product::where('is_active', true)
                ->orderBy('views_count', 'desc')
                ->limit($limit)
                ->get();
        }

        // Get categories from recently viewed products
        $categoryIds = $recentlyViewed->pluck('category_id')->unique();

        // Find similar products from same categories
        return Product::whereIn('category_id', $categoryIds)
            ->where('is_active', true)
            ->whereNotIn('id', $recentlyViewed->pluck('id'))
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    /**
     * Record view in cache (fallback).
     */
    protected function recordViewInCache(User $user, Product $product): void
    {
        $cacheKey = "browsing_history:{$user->id}";
        $history = cache()->get($cacheKey, []);

        // Remove if already exists
        $history = array_filter($history, fn($item) => $item['product_id'] !== $product->id);

        // Add to beginning
        array_unshift($history, [
            'product_id' => $product->id,
            'viewed_at' => now()->toISOString(),
        ]);

        // Keep only last 50
        $history = array_slice($history, 0, 50);

        cache()->put($cacheKey, $history, now()->addDays(30));
    }

    /**
     * Get recently viewed from cache (fallback).
     */
    protected function getRecentlyViewedFromCache(User $user, int $limit): Collection
    {
        $cacheKey = "browsing_history:{$user->id}";
        $history = cache()->get($cacheKey, []);

        $productIds = collect($history)
            ->take($limit)
            ->pluck('product_id');

        return Product::whereIn('id', $productIds)
            ->with(['media', 'variants'])
            ->get()
            ->sortBy(function ($product) use ($productIds) {
                return $productIds->search($product->id);
            })
            ->values();
    }

    /**
     * Clear history from cache (fallback).
     */
    protected function clearHistoryFromCache(User $user): bool
    {
        $cacheKey = "browsing_history:{$user->id}";
        cache()->forget($cacheKey);
        return true;
    }
}
