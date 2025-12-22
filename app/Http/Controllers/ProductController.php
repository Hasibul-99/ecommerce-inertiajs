<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
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
        $query = Product::with(['vendor', 'category', 'variants', 'tags', 'reviews'])
            ->where('status', 'published')
            ->whereHas('variants', function ($q) {
                $q->where('stock_quantity', '>', 0);
            });

        // Search
        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Tags filter
        if ($request->has('tags') && is_array($request->tags)) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->whereIn('slug', $request->tags);
            });
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('price_cents', '>=', $request->min_price * 100);
            });
        }
        if ($request->has('max_price')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('price_cents', '<=', $request->max_price * 100);
            });
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('title', 'desc');
                break;
            case 'price_asc':
            case 'price_low':
                $query->join('product_variants', 'products.id', '=', 'product_variants.product_id')
                    ->select('products.*')
                    ->groupBy('products.id')
                    ->orderByRaw('MIN(product_variants.price_cents) ASC');
                break;
            case 'price_desc':
            case 'price_high':
                $query->join('product_variants', 'products.id', '=', 'product_variants.product_id')
                    ->select('products.*')
                    ->groupBy('products.id')
                    ->orderByRaw('MIN(product_variants.price_cents) DESC');
                break;
            case 'popular':
                $query->withCount('reviews')->orderBy('reviews_count', 'desc');
                break;
            case 'rating':
                $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(12)->withQueryString();

        // Transform products for frontend
        $products->getCollection()->transform(function ($product) {
            $totalStock = $product->variants->sum('stock_quantity');
            $minPrice = $product->variants->min('price_cents');
            $averageRating = $product->reviews()->approved()->avg('rating') ?? 0;
            $reviewsCount = $product->reviews()->approved()->count();

            return [
                'id' => $product->id,
                'name' => $product->title,
                'slug' => $product->slug,
                'price' => $minPrice ?? $product->base_price_cents,
                'old_price' => null,
                'image' => $product->getMedia('images')->first()?->getUrl() ?? null,
                'rating' => round($averageRating, 1),
                'reviews_count' => $reviewsCount,
                'is_new' => $product->created_at->isAfter(now()->subDays(30)),
                'is_sale' => false,
                'discount_percentage' => 0,
                'in_stock' => $totalStock > 0,
            ];
        });

        // Get categories for filter
        $categories = Category::withCount('products')
            ->where('parent_id', null)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'products_count' => $category->products_count,
                ];
            });

        // Get tags for filter (assuming you have a Tag model)
        $tags = \App\Models\Tag::all()->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ];
        });

        // Get cart and wishlist counts
        $cartCount = 0;
        $wishlistCount = 0;
        if (auth()->check()) {
            $cart = \App\Models\Cart::where('user_id', auth()->id())->first();
            if ($cart) {
                $cartCount = $cart->items()->count();
            }
            $wishlistCount = \App\Models\Wishlist::where('user_id', auth()->id())->count();
        }

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['search', 'category', 'tags', 'min_price', 'max_price', 'sort']),
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
            $cart = \App\Models\Cart::where('user_id', auth()->id())->first();
            if ($cart) {
                $cartCount = $cart->items()->count();
            }
            $wishlistCount = \App\Models\Wishlist::where('user_id', auth()->id())->count();
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