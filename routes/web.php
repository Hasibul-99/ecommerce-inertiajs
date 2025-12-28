<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboardController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\WishlistController;
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

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Home & Info Pages
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about-us', [HomeController::class, 'aboutUs'])->name('about-us');
Route::get('/about', [HomeController::class, 'aboutUs'])->name('about');
Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('contact-us');
Route::get('/contact', [HomeController::class, 'contactUs'])->name('contact');
Route::post('/contact-us', [HomeController::class, 'submitContactForm'])->name('contact.submit');
Route::post('/contact', [HomeController::class, 'submitContactForm'])->name('contact.submit.alt');

// SEO Routes
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');

// Product Routes (Public)
Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'index')->name('products.index');
    Route::get('/product/{id}', 'show')->name('product.detail');
});

// Category Routes (Public)
Route::controller(CategoryController::class)->group(function () {
    Route::get('/categories', 'index')->name('categories.index');
    Route::get('/category/{slug}', 'show')->name('category.show');
});

// Shopping Cart & Wishlist (Public Access)
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');

// Compare Page
Route::get('/compare', fn() => Inertia::render('Compare'))->name('compare');

// Review Routes
Route::controller(\App\Http\Controllers\ReviewController::class)->prefix('products/{product}/reviews')->name('reviews.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store');
    Route::patch('/{review}', 'update')->name('update');
    Route::delete('/{review}', 'destroy')->name('destroy');
    Route::post('/{review}/helpful', 'markHelpful')->name('helpful');
});

/*
|--------------------------------------------------------------------------
| Webhook Routes (No CSRF Protection)
|--------------------------------------------------------------------------
*/
Route::prefix('webhooks')->name('webhooks.')->withoutMiddleware('csrf')->group(function () {
    Route::post('/payment', [WebhookController::class, 'handlePaymentWebhook'])->name('payment');
    Route::post('/shipping', [WebhookController::class, 'handleShippingWebhook'])->name('shipping');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');
    
    // Profile Management
    Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });
    
    // Product Management (Authenticated)
    Route::resource('products', ProductController::class)->except(['index', 'show']);
    
    // Product Image Management
    Route::controller(ProductImageController::class)->prefix('products/{product}/images')->name('products.images.')->group(function () {
        Route::post('/', 'store')->name('store');
        Route::delete('/{mediaId}', 'destroy')->name('destroy');
    });
    
    // Cart Management
    Route::controller(CartController::class)->prefix('cart')->name('cart.')->group(function () {
        Route::post('/add', 'addItem')->name('add');
        Route::patch('/{itemId}', 'updateItem')->name('update');
        Route::delete('/{itemId}', 'removeItem')->name('remove');
        Route::delete('/', 'clear')->name('clear');
    });
    
    // Analytics
    Route::get('/api/analytics/customer', [AnalyticsController::class, 'customerAnalytics'])->name('analytics.customer');

    // Wishlist Management
    Route::controller(WishlistController::class)->prefix('wishlist')->name('wishlist.')->group(function () {
        Route::post('/add', 'addItem')->name('add');
        Route::delete('/{productId}', 'removeItem')->name('remove');
        Route::delete('/', 'clear')->name('clear');
        Route::post('/{productId}/move-to-cart', 'moveToCart')->name('move-to-cart');
    });
    
    // Checkout Process
    Route::controller(CheckoutController::class)->prefix('checkout')->name('checkout')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'process')->name('.process');
    });
    
    // Order Management
    Route::controller(OrderController::class)->prefix('orders')->name('orders.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{order}', 'show')->name('show');
        Route::get('/{order}/track', 'track')->name('track');
        Route::get('/{order}/invoice', 'invoice')->name('invoice');
        Route::post('/{order}/cancel', 'cancel')->name('cancel');
        Route::post('/{order}/return', 'requestReturn')->name('return');
    });
    
    // Payment Processing
    Route::controller(PaymentController::class)->prefix('payment')->name('payment.')->group(function () {
        Route::get('/{order}', 'show')->name('show');
        Route::post('/{order}', 'process')->name('process');
    });
});

/*
|--------------------------------------------------------------------------
| Vendor Routes
|--------------------------------------------------------------------------
*/
Route::prefix('vendor')->middleware(['auth', 'verified', 'role:vendor'])->name('vendor.')->group(function () {
    Route::controller(VendorDashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('dashboard');
        Route::get('/products', 'products')->name('products');
        Route::get('/orders', 'orders')->name('orders');
        Route::get('/settings', 'settings')->name('settings');
        Route::patch('/settings', 'updateSettings')->name('settings.update');
    });

    // Vendor Analytics
    Route::get('/api/analytics', [AnalyticsController::class, 'vendorAnalytics'])->name('analytics');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin|super-admin'])->name('admin.')->group(function () {
    
    // Admin Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // User Management
    Route::resource('users', UserController::class);
    Route::patch('/users/{user}/toggle-verification', [UserController::class, 'toggleVerification'])->name('users.toggle-verification');
    
    // Product Management
    Route::resource('products', AdminProductController::class);
    Route::patch('/products/bulk-update-status', [AdminProductController::class, 'bulkUpdateStatus'])->name('products.bulk-update-status');
    
    // Product Variant Management
    Route::resource('product-variants', ProductVariantController::class);
    
    // Category Management
    Route::resource('categories', AdminCategoryController::class);
    
    // Tag Management
    Route::resource('tags', TagController::class);
    
    // Coupon Management
    Route::resource('coupons', CouponController::class);
    Route::controller(CouponController::class)->prefix('coupons')->name('coupons.')->group(function () {
        Route::patch('/{coupon}/toggle-status', 'toggleStatus')->name('toggle-status');
        Route::patch('/bulk-update-status', 'bulkUpdateStatus')->name('bulk-update-status');
    });
    
    // Role & Permission Management
    Route::resource('roles', RoleController::class);
    Route::controller(RoleController::class)->group(function () {
        Route::get('/permissions', 'permissions')->name('permissions.index');
        Route::post('/permissions', 'storePermission')->name('permissions.store');
        Route::patch('/permissions/{permission}', 'updatePermission')->name('permissions.update');
        Route::delete('/permissions/{permission}', 'destroyPermission')->name('permissions.destroy');
    });
    
    // Order Management
    Route::controller(AdminOrderController::class)->prefix('orders')->name('orders.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{order}', 'show')->name('show');
        Route::post('/{order}/update-status', 'updateStatus')->name('update-status');
        Route::post('/{order}/mark-as-paid', 'markAsPaid')->name('mark-as-paid');
    });
    
    // Activity Logs
    Route::controller(ActivityLogController::class)->prefix('activity-logs')->name('activity-logs.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{activityLog}', 'show')->name('show');
    });
    
    // Vendor Management
    Route::resource('vendors', VendorController::class);
    Route::controller(VendorController::class)->prefix('vendors')->name('vendors.')->group(function () {
        Route::patch('/{vendor}/status', 'updateStatus')->name('status');
    });
    
    // Vendor & Payout Status Updates (from DashboardController)
    Route::controller(AdminDashboardController::class)->group(function () {
        Route::patch('/vendors/{vendor}/approve', 'updateVendorStatus')->name('vendors.approve');
        Route::patch('/payouts/{payout}/process', 'updatePayoutStatus')->name('payouts.process');
    });
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';