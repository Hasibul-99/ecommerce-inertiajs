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
        // Get featured products (is_featured = true, is_active = true, with stock)
        $featuredProducts = Product::with(['vendor', 'category', 'media'])
            ->where('is_featured', true)
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($product) {
                // Calculate sale price if available
                $salePrice = $product->sale_price_cents ?? null;
                $originalPrice = $product->price_cents ?: $product->base_price_cents;
                $discountPercentage = 0;

                if ($salePrice && $salePrice < $originalPrice) {
                    $discountPercentage = round((($originalPrice - $salePrice) / $originalPrice) * 100);
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name ?: $product->title,
                    'slug' => $product->slug,
                    'price' => $salePrice ?? $originalPrice,
                    'old_price' => $salePrice ? $originalPrice : null,
                    'image' => $product->getFirstMediaUrl('images') ?: null,
                    'rating' => round($product->average_rating ?? 0, 1),
                    'reviews_count' => $product->reviews_count ?? 0,
                    'is_new' => $product->created_at->isAfter(now()->subDays(30)),
                    'is_sale' => $salePrice && $salePrice < $originalPrice,
                    'discount_percentage' => $discountPercentage,
                    'in_stock' => $product->stock_quantity > 0,
                ];
            });

        // Get deal products (products on sale with active status and stock)
        $dealProducts = Product::with(['vendor', 'category', 'media'])
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereNotNull('sale_price_cents')
            ->whereColumn('sale_price_cents', '<', 'price_cents')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function ($product) {
                $salePrice = $product->sale_price_cents;
                $originalPrice = $product->price_cents ?: $product->base_price_cents;
                $discountPercentage = 0;

                if ($salePrice && $salePrice < $originalPrice) {
                    $discountPercentage = round((($originalPrice - $salePrice) / $originalPrice) * 100);
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name ?: $product->title,
                    'slug' => $product->slug,
                    'price' => $salePrice,
                    'old_price' => $originalPrice,
                    'image' => $product->getFirstMediaUrl('images') ?: null,
                    'rating' => round($product->average_rating ?? 0, 1),
                    'reviews_count' => $product->reviews_count ?? 0,
                    'is_new' => false,
                    'is_sale' => true,
                    'discount_percentage' => $discountPercentage,
                    'in_stock' => $product->stock_quantity > 0,
                ];
            });

        // Get new products (created in last 30 days, active, with stock)
        $newProducts = Product::with(['vendor', 'category', 'media'])
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->where('created_at', '>=', now()->subDays(30))
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($product) {
                $salePrice = $product->sale_price_cents ?? null;
                $originalPrice = $product->price_cents ?: $product->base_price_cents;
                $discountPercentage = 0;

                if ($salePrice && $salePrice < $originalPrice) {
                    $discountPercentage = round((($originalPrice - $salePrice) / $originalPrice) * 100);
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name ?: $product->title,
                    'slug' => $product->slug,
                    'price' => $salePrice ?? $originalPrice,
                    'old_price' => $salePrice ? $originalPrice : null,
                    'image' => $product->getFirstMediaUrl('images') ?: null,
                    'rating' => round($product->average_rating ?? 0, 1),
                    'reviews_count' => $product->reviews_count ?? 0,
                    'is_new' => true,
                    'is_sale' => $salePrice && $salePrice < $originalPrice,
                    'discount_percentage' => $discountPercentage,
                    'in_stock' => $product->stock_quantity > 0,
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
                    'image_url' => $category->image_url,
                    'products_count' => $category->products_count,
                ];
            });

        // Get cart and wishlist counts for logged in users
        $cartCount = 0;
        $wishlistCount = 0;

        if (Auth::check()) {
            $cartCount = Cart::getItemCountForUser(Auth::id());
            $wishlistCount = Wishlist::getItemCountForUser(Auth::id());
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
            $cartCount = Cart::getItemCountForUser(Auth::id());
            $wishlistCount = Wishlist::getItemCountForUser(Auth::id());
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
            $cartCount = Cart::getItemCountForUser(Auth::id());
            $wishlistCount = Wishlist::getItemCountForUser(Auth::id());
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