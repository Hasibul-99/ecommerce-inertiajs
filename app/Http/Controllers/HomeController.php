<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Cart;
use App\Models\Wishlist;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get featured products (published products with stock)
        $featuredProducts = Product::with(['vendor', 'category', 'variants', 'reviews'])
            ->where('status', 'published')
            ->whereHas('variants', function ($query) {
                $query->where('stock_quantity', '>', 0);
            })
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($product) {
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

        // Get deal products (recently published products with good ratings)
        $dealProducts = Product::with(['vendor', 'category', 'variants', 'reviews'])
            ->where('status', 'published')
            ->whereHas('variants', function ($query) {
                $query->where('stock_quantity', '>', 0);
            })
            ->whereHas('reviews', function ($query) {
                $query->where('is_approved', true)
                    ->where('rating', '>=', 4);
            })
            ->latest('published_at')
            ->take(5)
            ->get()
            ->map(function ($product) {
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
                    'is_new' => false,
                    'is_sale' => false,
                    'discount_percentage' => 0,
                    'in_stock' => $totalStock > 0,
                ];
            });

        // Get new products (created in last 30 days)
        $newProducts = Product::with(['vendor', 'category', 'variants', 'reviews'])
            ->where('status', 'published')
            ->whereHas('variants', function ($query) {
                $query->where('stock_quantity', '>', 0);
            })
            ->where('created_at', '>=', now()->subDays(30))
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($product) {
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
                    'is_new' => true,
                    'is_sale' => false,
                    'discount_percentage' => 0,
                    'in_stock' => $totalStock > 0,
                ];
            });

        // Get featured categories
        $categories = Category::withCount('products')
            ->where('parent_id', null)
            ->take(12)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image ?? null,
                    'products_count' => $category->products_count,
                ];
            });

        // Get cart and wishlist counts for logged in users
        $cartCount = 0;
        $wishlistCount = 0;

        if (Auth::check()) {
            $cartCount = Cart::where('user_id', Auth::id())->count();
            $wishlistCount = Wishlist::where('user_id', Auth::id())->count();
        }

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'featuredProducts' => $featuredProducts,
            'dealProducts' => $dealProducts,
            'newProducts' => $newProducts,
            'categories' => $categories,
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    /**
     * Display the about us page.
     *
     * @return \Inertia\Response
     */
    public function aboutUs()
    {
        // Get cart and wishlist counts
        $cartCount = 0;
        $wishlistCount = 0;

        if (Auth::check()) {
            $cart = Cart::where('user_id', Auth::id())->first();
            if ($cart) {
                $cartCount = $cart->items()->count();
            }
            $wishlistCount = Wishlist::where('user_id', Auth::id())->count();
        }

        return Inertia::render('AboutUs/Index', [
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    /**
     * Display the contact us page.
     *
     * @return \Inertia\Response
     */
    public function contactUs()
    {
        // Get cart and wishlist counts
        $cartCount = 0;
        $wishlistCount = 0;

        if (Auth::check()) {
            $cart = Cart::where('user_id', Auth::id())->first();
            if ($cart) {
                $cartCount = $cart->items()->count();
            }
            $wishlistCount = Wishlist::where('user_id', Auth::id())->count();
        }

        return Inertia::render('ContactUs/Index', [
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
        ]);
    }

    /**
     * Handle contact form submission.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitContactForm()
    {
        // Handle contact form submission
        return redirect()->back()->with('success', 'Your message has been sent!');
    }
}