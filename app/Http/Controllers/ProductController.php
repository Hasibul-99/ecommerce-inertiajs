<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;
use App\Models\Category;
use App\Services\ProductSearchService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected ProductSearchService $searchService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(ProductSearchService $searchService)
    {
        $this->searchService = $searchService;
        $this->middleware('auth')->except(['index', 'show']);
    }

    /**
     * Display a listing of the products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Prepare filters from request
        $filters = [
            'categories' => $request->input('categories', $request->input('category')),
            'category_slug' => $request->input('category'),
            'vendors' => $request->input('vendors'),
            'tags' => $request->input('tags'),
            'price_min' => $request->input('price_min', $request->input('min_price')),
            'price_max' => $request->input('price_max', $request->input('max_price')),
            'rating' => $request->input('rating'),
            'in_stock' => $request->boolean('in_stock'),
            'featured' => $request->boolean('featured'),
            'on_sale' => $request->boolean('on_sale'),
            'attributes' => $request->input('attributes', []),
            'sort_by' => $request->input('sort_by', $request->input('sort', 'newest')),
            'per_page' => $request->input('per_page', 24),
        ];

        // Remove null values
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '' && $value !== [];
        });

        // Perform search
        $searchQuery = $request->input('search', $request->input('q', '')) ?? '';
        $products = $this->searchService->search($searchQuery, $filters);

        // Transform products for frontend
        $products->getCollection()->transform(function ($product) {
            // Get first image from media library
            $firstImage = $product->getFirstMediaUrl('images');

            // Calculate sale price if available
            $salePrice = $product->sale_price_cents ?? null;
            $originalPrice = $product->price_cents;
            $discountPercentage = 0;

            if ($salePrice && $salePrice < $originalPrice) {
                $discountPercentage = round((($originalPrice - $salePrice) / $originalPrice) * 100);
            }

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price_cents' => $salePrice ?? $originalPrice,
                'original_price_cents' => $originalPrice,
                'image' => $firstImage ?: null,
                'rating' => round($product->average_rating ?? 0, 1),
                'reviews_count' => $product->reviews_count ?? 0,
                'is_new' => $product->created_at->isAfter(now()->subDays(30)),
                'is_sale' => $salePrice && $salePrice < $originalPrice,
                'discount_percentage' => $discountPercentage,
                'in_stock' => $product->stock_quantity > 0,
                'vendor_name' => $product->vendor ? $product->vendor->business_name : null,
            ];
        });

        // Get filter options
        $filterOptions = $this->searchService->getFilterOptions($request->input('category'));

        // Get cart and wishlist counts
        $cartCount = 0;
        $wishlistCount = 0;
        if (auth()->check()) {
            $cartCount = \App\Models\Cart::getItemCountForUser(auth()->id());
            $wishlistCount = \App\Models\Wishlist::getItemCountForUser(auth()->id());
        }

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filterOptions' => $filterOptions,
            'filters' => array_merge([
                'search' => $searchQuery,
                'category' => $request->input('category'),
                'categories' => $request->input('categories', []),
                'vendors' => $request->input('vendors', []),
                'tags' => $request->input('tags', []),
                'price_min' => $request->input('price_min'),
                'price_max' => $request->input('price_max'),
                'rating' => $request->input('rating'),
                'in_stock' => $request->boolean('in_stock'),
                'featured' => $request->boolean('featured'),
                'on_sale' => $request->boolean('on_sale'),
                'sort_by' => $filters['sort_by'] ?? 'newest',
                'view' => $request->input('view', 'grid'),
            ]),
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    /**
     * Show the form for creating a new product.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $this->authorize('create', Product::class);

        $categories = Category::all();

        return Inertia::render('Product/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \App\Http\Requests\ProductStoreRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ProductStoreRequest $request)
    {
        $this->authorize('create', Product::class);

        $product = Product::create($request->validated());

        return redirect()->route('products.show', $product)
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     *
     * @param  string  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $product = Product::with(['category', 'variants', 'vendor', 'tags', 'reviews.user'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        // Get related products from the same category
        $relatedProducts = Product::with(['variants'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'published')
            ->whereHas('variants', function ($query) {
                $query->where('stock_quantity', '>', 0);
            })
            ->limit(4)
            ->get()
            ->map(function ($relatedProduct) {
                $minPrice = $relatedProduct->variants->min('price_cents');
                $totalStock = $relatedProduct->variants->sum('stock_quantity');

                return [
                    'id' => $relatedProduct->id,
                    'name' => $relatedProduct->title,
                    'slug' => $relatedProduct->slug,
                    'price' => $minPrice ?? $relatedProduct->base_price_cents,
                    'old_price' => null,
                    'image' => $relatedProduct->getMedia('images')->first()?->getUrl() ?? null,
                    'in_stock' => $totalStock > 0,
                ];
            });

        // Get reviews data
        $reviews = $product->reviews()
            ->with('user')
            ->approved()
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'is_verified_purchase' => $review->is_verified_purchase,
                    'helpful_count' => $review->helpful_count,
                    'created_at' => $review->created_at->toISOString(),
                    'user' => [
                        'name' => $review->user->name,
                    ],
                ];
            });

        // Calculate ratings summary
        $ratingsBreakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $product->reviews()->approved()->where('rating', $i)->count();
            $ratingsBreakdown[$i] = $count;
        }

        $averageRating = $product->reviews()->approved()->avg('rating') ?? 0;
        $totalReviews = $product->reviews()->approved()->count();

        // Check if user can review
        $canReview = false;
        $userHasReviewed = false;
        if (auth()->check()) {
            $userHasReviewed = $product->reviews()->where('user_id', auth()->id())->exists();

            // User can review if they purchased the product
            $hasPurchased = \App\Models\OrderItem::whereHas('order', function ($query) {
                $query->where('user_id', auth()->id())
                    ->whereIn('status', ['delivered', 'completed']);
            })
            ->where('product_id', $product->id)
            ->exists();

            $canReview = $hasPurchased && !$userHasReviewed;
        }

        // Get cart and wishlist counts
        $cartCount = 0;
        $wishlistCount = 0;
        if (auth()->check()) {
            $cartCount = \App\Models\Cart::getItemCountForUser(auth()->id());
            $wishlistCount = \App\Models\Wishlist::getItemCountForUser(auth()->id());
        }

        // Format product data for frontend
        $formattedProduct = [
            'id' => $product->id,
            'title' => $product->title,
            'slug' => $product->slug,
            'description' => $product->description,
            'base_price_cents' => $product->base_price_cents,
            'status' => $product->status,
            'images' => $product->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumb' => $media->getUrl('thumb'),
                ];
            })->toArray(),
            'variants' => $product->variants->map(function ($variant) {
                // Convert attributes object to array format for frontend
                $attributes = [];
                if ($variant->attributes) {
                    if (is_array($variant->attributes)) {
                        foreach ($variant->attributes as $key => $value) {
                            $attributes[] = [
                                'name' => ucfirst($key),
                                'value' => $value,
                            ];
                        }
                    }
                }

                return [
                    'id' => $variant->id,
                    'sku' => $variant->sku,
                    'price_cents' => $variant->price_cents,
                    'stock_quantity' => $variant->stock_quantity,
                    'is_default' => $variant->is_default,
                    'attributes' => $attributes,
                ];
            })->toArray(),
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'vendor' => $product->vendor ? [
                'id' => $product->vendor->id,
                'business_name' => $product->vendor->business_name,
            ] : null,
            'tags' => $product->tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ];
            })->toArray(),
        ];

        return Inertia::render('Product/Show', [
            'product' => $formattedProduct,
            'relatedProducts' => $relatedProducts,
            'reviews' => $reviews,
            'reviewsSummary' => [
                'average_rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews,
                'ratings_breakdown' => $ratingsBreakdown,
            ],
            'canReview' => $canReview,
            'userHasReviewed' => $userHasReviewed,
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     *
     * @param  \App\Models\Product  $product
     * @return \Inertia\Response
     */
    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $categories = Category::all();

        return Inertia::render('Product/Edit', [
            'product' => $product->load(['images', 'variants', 'attributes']),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \App\Http\Requests\ProductUpdateRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProductUpdateRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $product->update($request->validated());

        return redirect()->route('products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}