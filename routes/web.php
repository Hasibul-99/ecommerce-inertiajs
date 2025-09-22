<?php

use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Vendor\DashboardController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\WishlistController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.detail');

Route::get('/cart', [CartController::class, 'index'])->name('cart');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');

Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');

Route::get('/compare', function () {
    return Inertia::render('Compare');
})->name('compare');

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/category/{slug}', [CategoryController::class, 'show'])->name('category.show');

Route::get('/about-us', [HomeController::class, 'aboutUs'])->name('about-us');

Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('contact-us');
Route::post('/contact-us', [HomeController::class, 'submitContactForm'])->name('contact.submit');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Product routes
Route::resource('products', ProductController::class)->except(['index', 'show']);

// Cart routes
Route::post('/cart/add', [CartController::class, 'addItem'])->name('cart.add');
Route::patch('/cart/{itemId}', [CartController::class, 'updateItem'])->name('cart.update');
Route::delete('/cart/{itemId}', [CartController::class, 'removeItem'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Wishlist routes
Route::post('/wishlist/add', [WishlistController::class, 'addItem'])->name('wishlist.add');
Route::delete('/wishlist/{productId}', [WishlistController::class, 'removeItem'])->name('wishlist.remove');
Route::delete('/wishlist', [WishlistController::class, 'clear'])->name('wishlist.clear');
Route::post('/wishlist/{productId}/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');

// Order routes
Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
Route::post('/orders/{order}/return', [OrderController::class, 'requestReturn'])->name('orders.return');
Route::get('/orders/{order}/track', [OrderController::class, 'track'])->name('orders.track');
Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');

// Payment routes
Route::get('/payment/{order}', [PaymentController::class, 'show'])->name('payment.show');
Route::post('/payment/{order}', [PaymentController::class, 'process'])->name('payment.process');

// Webhook routes
Route::post('/webhooks/payment', [WebhookController::class, 'handlePaymentWebhook'])->name('webhooks.payment');
Route::post('/webhooks/shipping', [WebhookController::class, 'handleShippingWebhook'])->name('webhooks.shipping');

// Vendor routes
Route::prefix('vendor')->middleware(['auth', 'role:vendor'])->name('vendor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [DashboardController::class, 'products'])->name('products');
    Route::get('/orders', [DashboardController::class, 'orders'])->name('orders');
    Route::get('/settings', [DashboardController::class, 'settings'])->name('settings');
    Route::patch('/settings', [DashboardController::class, 'updateSettings'])->name('settings.update');
});

// Admin routes
Route::prefix('admin')->middleware(['auth', 'role:admin'])->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::patch('/vendors/{vendor}/status', [VendorController::class, 'updateStatus'])->name('vendors.status');
    Route::patch('/vendors/{vendor}/approve', [\App\Http\Controllers\Admin\DashboardController::class, 'updateVendorStatus'])->name('vendors.approve');
    Route::patch('/payouts/{payout}/process', [\App\Http\Controllers\Admin\DashboardController::class, 'updatePayoutStatus'])->name('payouts.process');
    Route::resource('vendors', VendorController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
