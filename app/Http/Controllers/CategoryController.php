<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $categories = Category::withCount('products')
            ->whereNull('parent_id')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'image' => $category->image,
                    'products_count' => $category->products_count,
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

        return Inertia::render('Category/Index', [
            'categories' => $categories->toArray(),
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    /**
     * Display the specified category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $slug
     * @return \Inertia\Response
     */
    public function show(Request $request, $slug)
    {
        $category = Category::withCount('products')
            ->where('slug', $slug)
            ->firstOrFail();

        $query = $category->products()
            ->with(['variants', 'reviews'])
            ->where('status', 'published')
            ->whereHas('variants', function ($q) {
                $q->where('stock_quantity', '>', 0);
            });

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
            case 'price_low':
                $query->join('product_variants', 'products.id', '=', 'product_variants.product_id')
                    ->select('products.*')
                    ->groupBy('products.id')
                    ->orderByRaw('MIN(product_variants.price_cents) ASC');
                break;
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
                $query->latest();
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

        return Inertia::render('Category/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image' => $category->image,
                'products_count' => $category->products_count,
            ],
            'products' => $products,
            'filters' => [
                'sort' => $sort,
                'min_price' => $request->get('min_price'),
                'max_price' => $request->get('max_price'),
            ],
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }
}