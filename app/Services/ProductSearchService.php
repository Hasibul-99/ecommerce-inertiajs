<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use App\Models\Tag;
use App\Models\Vendor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProductSearchService
{
    /**
     * Search products with advanced filtering.
     */
    public function search(string $query = '', array $filters = []): LengthAwarePaginator
    {
        $productsQuery = Product::query()
            ->with(['categories', 'vendor', 'tags', 'media'])
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0); // Only show products in stock

        // Text search
        if (!empty($query)) {
            $productsQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('sku', 'like', "%{$query}%");
            });

            // Track popular searches
            $this->trackSearch($query);
        }

        // Category filter (single or multiple)
        if (!empty($filters['categories'])) {
            $categoryIds = is_array($filters['categories'])
                ? $filters['categories']
                : [$filters['categories']];

            $productsQuery->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            });
        }

        // Category slug filter
        if (!empty($filters['category_slug'])) {
            $productsQuery->whereHas('categories', function ($q) use ($filters) {
                $q->where('slug', $filters['category_slug']);
            });
        }

        // Price range filter
        if (isset($filters['price_min'])) {
            $productsQuery->where('price_cents', '>=', (int) ($filters['price_min'] * 100));
        }
        if (isset($filters['price_max'])) {
            $productsQuery->where('price_cents', '<=', (int) ($filters['price_max'] * 100));
        }

        // Vendor filter
        if (!empty($filters['vendors'])) {
            $vendorIds = is_array($filters['vendors'])
                ? $filters['vendors']
                : [$filters['vendors']];

            $productsQuery->whereIn('vendor_id', $vendorIds);
        }

        // Rating filter (4+, 3+, etc.)
        if (!empty($filters['rating'])) {
            $minRating = (float) $filters['rating'];
            $productsQuery->where('average_rating', '>=', $minRating);
        }

        // Availability filter is already applied by default (stock_quantity > 0)
        // Users cannot override this on the products page

        // Tags filter
        if (!empty($filters['tags'])) {
            $tagIds = is_array($filters['tags'])
                ? $filters['tags']
                : [$filters['tags']];

            $productsQuery->whereHas('tags', function ($q) use ($tagIds) {
                $q->whereIn('tags.id', $tagIds);
            });
        }

        // Dynamic attribute filters
        if (!empty($filters['attributes']) && is_array($filters['attributes'])) {
            foreach ($filters['attributes'] as $attributeName => $attributeValue) {
                $productsQuery->whereJsonContains(
                    'attributes->' . $attributeName,
                    $attributeValue
                );
            }
        }

        // Featured products filter
        if (!empty($filters['featured'])) {
            $productsQuery->where('is_featured', true);
        }

        // On sale filter
        if (!empty($filters['on_sale'])) {
            $productsQuery->whereNotNull('sale_price_cents')
                ->where('sale_price_cents', '<', DB::raw('price_cents'));
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'newest';

        switch ($sortBy) {
            case 'price_low_high':
                $productsQuery->orderBy('price_cents', 'asc');
                break;
            case 'price_high_low':
                $productsQuery->orderBy('price_cents', 'desc');
                break;
            case 'popularity':
                $productsQuery->orderBy('sales_count', 'desc');
                break;
            case 'rating':
                $productsQuery->orderBy('average_rating', 'desc')
                    ->orderBy('reviews_count', 'desc');
                break;
            case 'name_asc':
                $productsQuery->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $productsQuery->orderBy('name', 'desc');
                break;
            case 'newest':
            default:
                $productsQuery->orderBy('created_at', 'desc');
                break;
        }

        // Fallback sorting for consistency
        $productsQuery->orderBy('id', 'desc');

        // Pagination
        $perPage = $filters['per_page'] ?? 24;

        return $productsQuery->paginate($perPage);
    }

    /**
     * Get available filter options based on current query/filters.
     */
    public function getFilterOptions(?string $categorySlug = null): array
    {
        $cacheKey = 'filter_options_' . ($categorySlug ?? 'all');

        return Cache::remember($cacheKey, 3600, function () use ($categorySlug) {
            $query = Product::query()->where('is_active', true);

            // If category specified, filter by category
            if ($categorySlug) {
                $query->whereHas('categories', function ($q) use ($categorySlug) {
                    $q->where('slug', $categorySlug);
                });
            }

            // Get price range
            $priceStats = $query->selectRaw('
                MIN(price_cents) as min_price_cents,
                MAX(price_cents) as max_price_cents
            ')->first();

            // Get available categories
            $categories = Category::withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])
            ->having('products_count', '>', 0)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'count' => $category->products_count,
                    'parent_id' => $category->parent_id,
                ];
            });

            // Get vendors with product counts
            $vendors = Vendor::where('status', 'approved')
                ->withCount(['products' => function ($q) {
                    $q->where('is_active', true);
                }])
                ->having('products_count', '>', 0)
                ->get()
                ->map(function ($vendor) {
                    return [
                        'id' => $vendor->id,
                        'name' => $vendor->business_name,
                        'count' => $vendor->products_count,
                    ];
                });

            // Get available tags
            $tags = Tag::withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])
            ->having('products_count', '>', 0)
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'count' => $tag->products_count,
                ];
            });

            // Get dynamic attributes from products
            $attributes = $this->getAvailableAttributes($categorySlug);

            // Rating options
            $ratingOptions = [
                ['value' => 4, 'label' => '4+ Stars', 'count' => Product::where('average_rating', '>=', 4)->count()],
                ['value' => 3, 'label' => '3+ Stars', 'count' => Product::where('average_rating', '>=', 3)->count()],
                ['value' => 2, 'label' => '2+ Stars', 'count' => Product::where('average_rating', '>=', 2)->count()],
            ];

            return [
                'price_range' => [
                    'min' => $priceStats->min_price_cents ? $priceStats->min_price_cents / 100 : 0,
                    'max' => $priceStats->max_price_cents ? $priceStats->max_price_cents / 100 : 1000,
                ],
                'categories' => $categories,
                'vendors' => $vendors,
                'tags' => $tags,
                'attributes' => $attributes,
                'ratings' => $ratingOptions,
                'availability' => [
                    ['value' => true, 'label' => 'In Stock Only', 'count' => Product::where('stock_quantity', '>', 0)->count()],
                ],
            ];
        });
    }

    /**
     * Get search suggestions based on query.
     */
    public function getSuggestions(string $query): array
    {
        if (strlen($query) < 2) {
            return [];
        }

        $suggestions = [];

        // Product name suggestions
        $products = Product::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('sku', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get(['id', 'name', 'slug', 'price_cents'])
            ->map(function ($product) {
                return [
                    'type' => 'product',
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price_cents / 100,
                ];
            });

        $suggestions = array_merge($suggestions, $products->toArray());

        // Category suggestions
        $categories = Category::where('name', 'like', "%{$query}%")
            ->limit(3)
            ->get(['id', 'name', 'slug'])
            ->map(function ($category) {
                return [
                    'type' => 'category',
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ];
            });

        $suggestions = array_merge($suggestions, $categories->toArray());

        // Vendor suggestions
        $vendors = Vendor::where('status', 'approved')
            ->where('business_name', 'like', "%{$query}%")
            ->limit(2)
            ->get(['id', 'business_name'])
            ->map(function ($vendor) {
                return [
                    'type' => 'vendor',
                    'id' => $vendor->id,
                    'name' => $vendor->business_name,
                ];
            });

        $suggestions = array_merge($suggestions, $vendors->toArray());

        return $suggestions;
    }

    /**
     * Get popular searches.
     */
    public function getPopularSearches(int $limit = 10): array
    {
        return Cache::remember('popular_searches', 3600, function () use ($limit) {
            return DB::table('search_logs')
                ->select('query', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('query')
                ->orderBy('count', 'desc')
                ->limit($limit)
                ->pluck('query')
                ->toArray();
        });
    }

    /**
     * Get recent searches for a user.
     */
    public function getRecentSearches(?int $userId = null, int $limit = 5): array
    {
        if (!$userId && !session()->has('session_id')) {
            return [];
        }

        $query = DB::table('search_logs')
            ->select('query')
            ->distinct()
            ->orderBy('created_at', 'desc')
            ->limit($limit);

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('session_id', session()->getId());
        }

        return $query->pluck('query')->toArray();
    }

    /**
     * Track search query for analytics.
     */
    protected function trackSearch(string $query): void
    {
        try {
            DB::table('search_logs')->insert([
                'query' => $query,
                'user_id' => auth()->id(),
                'session_id' => session()->getId(),
                'ip_address' => request()->ip(),
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Silently fail if table doesn't exist
            \Log::warning('Failed to track search: ' . $e->getMessage());
        }
    }

    /**
     * Get available product attributes for filtering.
     */
    protected function getAvailableAttributes(?string $categorySlug = null): array
    {
        $query = Product::query()->where('is_active', true);

        if ($categorySlug) {
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Get all products' attributes
        $products = $query->whereNotNull('attributes')
            ->select('attributes')
            ->get();

        $attributesMap = [];

        foreach ($products as $product) {
            if (is_array($product->attributes)) {
                foreach ($product->attributes as $key => $value) {
                    if (!isset($attributesMap[$key])) {
                        $attributesMap[$key] = [];
                    }

                    // Collect unique values for each attribute
                    if (is_array($value)) {
                        foreach ($value as $v) {
                            $attributesMap[$key][] = $v;
                        }
                    } else {
                        $attributesMap[$key][] = $value;
                    }
                }
            }
        }

        // Format attributes with unique values
        $formattedAttributes = [];
        foreach ($attributesMap as $name => $values) {
            $uniqueValues = array_unique($values);
            $formattedAttributes[] = [
                'name' => $name,
                'label' => ucwords(str_replace('_', ' ', $name)),
                'values' => array_values($uniqueValues),
            ];
        }

        return $formattedAttributes;
    }

    /**
     * Clear filter cache.
     */
    public function clearFilterCache(): void
    {
        Cache::forget('filter_options_all');
        Cache::forget('popular_searches');

        // Clear category-specific caches
        $categories = Category::pluck('slug');
        foreach ($categories as $slug) {
            Cache::forget('filter_options_' . $slug);
        }
    }
}
