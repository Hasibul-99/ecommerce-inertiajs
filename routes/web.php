<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CodReconciliationController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EmailTemplateController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PayoutController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Customer\AddressController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboardController;
use App\Http\Controllers\Vendor\EarningsController;
use App\Http\Controllers\Vendor\OrderController as VendorOrderController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Http\Controllers\Vendor\VendorRegistrationController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file contains all web routes for the application, organized into
| logical sections for better maintainability:
|
| 1. Public Routes (Guest & Authenticated)
| 2. Webhook Routes (No CSRF Protection)
| 3. Authenticated User Routes
| 4. Customer Dashboard Routes
| 5. Vendor Registration & Dashboard Routes
| 6. Admin Panel Routes
| 7. Authentication Routes
|
*/

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (Guest & Authenticated)
|--------------------------------------------------------------------------
| Routes accessible to all users without authentication
*/

// Homepage & Info Pages
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

// Product Browsing
Route::controller(ProductController::class)->prefix('products')->name('products.')->group(function () {
    Route::get('/', 'index')->name('index');
});
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.detail');

// Category Browsing
Route::controller(CategoryController::class)->group(function () {
    Route::get('/categories', 'index')->name('categories.index');
    Route::get('/category/{slug}', 'show')->name('category.show');
});

// Shopping Cart & Wishlist (Public viewing, auth required for modifications)
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');

// Product Comparison
Route::get('/compare', fn() => Inertia::render('Compare'))->name('compare');

// Product Reviews (Public viewing)
Route::controller(ReviewController::class)->prefix('products/{product}/reviews')->name('reviews.')->group(function () {
    Route::get('/', 'index')->name('index');
});

// Search & Autocomplete (Public API)
Route::controller(SearchController::class)->prefix('api/search')->name('search.')->group(function () {
    Route::get('/suggestions', 'suggestions')->name('suggestions');
    Route::get('/popular', 'popular')->name('popular');
});
Route::get('/api/products/filter-options', [SearchController::class, 'filterOptions'])->name('products.filter-options');

/*
|--------------------------------------------------------------------------
| 2. WEBHOOK ROUTES (No CSRF Protection)
|--------------------------------------------------------------------------
| External service callbacks for payment gateways, shipping providers, etc.
*/
Route::prefix('webhooks')->name('webhooks.')->withoutMiddleware('csrf')->group(function () {
    Route::post('/payment', [WebhookController::class, 'handlePaymentWebhook'])->name('payment');
    Route::post('/shipping', [WebhookController::class, 'handleShippingWebhook'])->name('shipping');
});

/*
|--------------------------------------------------------------------------
| 3. AUTHENTICATED USER ROUTES
|--------------------------------------------------------------------------
| Routes that require authentication but not specific roles
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // User Dashboard
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Profile Management
    Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    // Shopping Cart Management (Authenticated actions)
    Route::controller(CartController::class)->prefix('cart')->name('cart.')->group(function () {
        Route::post('/add', 'addItem')->name('add');
        Route::patch('/{itemId}', 'updateItem')->name('update');
        Route::delete('/{itemId}', 'removeItem')->name('remove');
        Route::delete('/', 'clear')->name('clear');
    });

    // Wishlist Management (Authenticated actions)
    Route::controller(WishlistController::class)->prefix('wishlist')->name('wishlist.')->group(function () {
        Route::post('/add', 'addItem')->name('add');
        Route::delete('/{productId}', 'removeItem')->name('remove');
        Route::delete('/', 'clear')->name('clear');
        Route::post('/{productId}/move-to-cart', 'moveToCart')->name('move-to-cart');
    });

    // Product Reviews (Authenticated actions)
    Route::controller(ReviewController::class)->prefix('products/{product}/reviews')->name('reviews.')->group(function () {
        Route::post('/', 'store')->name('store');
        Route::patch('/{review}', 'update')->name('update');
        Route::delete('/{review}', 'destroy')->name('destroy');
        Route::post('/{review}/helpful', 'markHelpful')->name('helpful');
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
        Route::post('/{order}/reorder', 'reorder')->name('reorder');
    });

    // Payment Processing
    Route::controller(PaymentController::class)->prefix('payment')->name('payment.')->group(function () {
        Route::get('/{order}', 'show')->name('show');
        Route::post('/{order}', 'process')->name('process');
    });

    // User Notifications
    Route::controller(NotificationController::class)->prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/recent', 'recent')->name('recent');
        Route::post('/{id}/mark-as-read', 'markAsRead')->name('mark-as-read');
        Route::post('/mark-all-as-read', 'markAllAsRead')->name('mark-all-as-read');
        Route::get('/preferences', 'preferences')->name('preferences');
        Route::post('/preferences', 'updatePreferences')->name('preferences.update');
    });
});

/*
|--------------------------------------------------------------------------
| 4. CUSTOMER DASHBOARD ROUTES
|--------------------------------------------------------------------------
| Customer-specific features and account management
*/
Route::middleware(['auth', 'verified'])->prefix('customer')->name('customer.')->group(function () {

    // Customer Dashboard Overview
    Route::controller(CustomerDashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('dashboard');
        Route::get('/orders', 'orders')->name('orders');
        Route::get('/addresses', 'addresses')->name('addresses');
        Route::get('/wishlist', 'wishlist')->name('wishlist');
        Route::get('/recently-viewed', 'recentlyViewed')->name('recently-viewed');
        Route::post('/clear-browsing-history', 'clearBrowsingHistory')->name('clear-browsing-history');
    });

    // Address Management
    Route::controller(AddressController::class)->prefix('addresses')->name('addresses.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{address}', 'update')->name('update');
        Route::delete('/{address}', 'destroy')->name('destroy');
        Route::post('/{address}/set-default', 'setDefault')->name('set-default');
    });

    // Customer Analytics
    Route::get('/analytics', [AnalyticsController::class, 'customerAnalytics'])->name('analytics');
});

/*
|--------------------------------------------------------------------------
| 5. VENDOR ROUTES
|--------------------------------------------------------------------------
| Vendor registration and vendor dashboard routes
*/

// Vendor Registration (No vendor role required - for new vendors)
Route::middleware(['auth', 'verified'])->prefix('vendor')->name('vendor.')->group(function () {
    Route::controller(VendorRegistrationController::class)->prefix('register')->name('register')->group(function () {
        Route::get('/', 'showRegistrationForm');

        // Multi-step registration
        Route::get('/step1', 'showStep1')->name('.step1');
        Route::post('/step1', 'storeStep1')->name('.step1.store');
        Route::get('/step2', 'showStep2')->name('.step2');
        Route::post('/step2', 'storeStep2')->name('.step2.store');
        Route::get('/step3', 'showStep3')->name('.step3');
        Route::post('/step3', 'storeStep3')->name('.step3.store');

        // Registration completion
        Route::get('/complete', 'showComplete')->name('.complete');
        Route::post('/submit', 'complete')->name('.submit');
    });
});

// Vendor Dashboard (Requires vendor role)
Route::middleware(['auth', 'verified', 'role:vendor'])->prefix('vendor')->name('vendor.')->group(function () {

    // Vendor Dashboard Overview
    Route::controller(VendorDashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('dashboard');
        Route::get('/products', 'products')->name('products');
        Route::get('/orders', 'orders')->name('orders');
        Route::get('/settings', 'settings')->name('settings');
        Route::patch('/settings', 'updateSettings')->name('settings.update');
    });

    // Vendor Analytics
    Route::prefix('analytics')->name('analytics')->group(function () {
        Route::get('/', [AnalyticsController::class, 'vendorAnalytics']); // API endpoint
        Route::controller(VendorDashboardController::class)->group(function () {
            Route::get('/sales', 'salesAnalytics')->name('.sales');
            Route::get('/products', 'productsAnalytics')->name('.products');
            Route::get('/customers', 'customersAnalytics')->name('.customers');
            Route::get('/export', 'exportAnalytics')->name('.export');
        });
    });

    // Vendor Product Management
    Route::controller(VendorProductController::class)->prefix('products')->name('products.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{product}/edit', 'edit')->name('edit');
        Route::put('/{product}', 'update')->name('update');
        Route::delete('/{product}', 'destroy')->name('destroy');
        Route::post('/{product}/duplicate', 'duplicate')->name('duplicate');
        Route::patch('/{product}/toggle-status', 'toggleStatus')->name('toggle-status');
        Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
    });

    // Vendor Product Images
    Route::controller(ProductImageController::class)->prefix('products/{product}/images')->name('products.images.')->group(function () {
        Route::post('/', 'store')->name('store');
        Route::delete('/{mediaId}', 'destroy')->name('destroy');
    });

    // Vendor Order Management
    Route::controller(VendorOrderController::class)->prefix('orders')->name('orders.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/export', 'exportOrders')->name('export');
        Route::get('/{order}', 'show')->name('show');
        Route::get('/{order}/packing-slip', 'downloadPackingSlip')->name('packing-slip');
        Route::get('/{order}/packing-slip/preview', 'previewPackingSlip')->name('packing-slip.preview');
        Route::post('/order-items/{orderItem}/update-status', 'updateItemStatus')->name('items.update-status');
        Route::post('/{order}/add-tracking', 'addShipmentTracking')->name('add-tracking');
    });

    // Vendor Earnings & Payouts
    Route::controller(EarningsController::class)->prefix('earnings')->name('earnings.')->group(function () {
        Route::get('/', 'dashboard')->name('dashboard');
        Route::get('/transactions', 'transactions')->name('transactions');
        Route::get('/transactions/export', 'exportTransactions')->name('transactions.export');
        Route::get('/payouts', 'payouts')->name('payouts');
        Route::post('/request-payout', 'requestPayout')->name('request-payout');
        Route::get('/payouts/{payout}', 'payoutDetails')->name('payout-details');
    });
});

/*
|--------------------------------------------------------------------------
| 6. ADMIN PANEL ROUTES
|--------------------------------------------------------------------------
| Administrator and super-administrator routes for platform management
*/
Route::middleware(['auth', 'verified', 'role:admin|super-admin'])->prefix('admin')->name('admin.')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Admin Dashboard & Overview
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | User Management
    |--------------------------------------------------------------------------
    */
    Route::resource('users', UserController::class);
    Route::patch('/users/{user}/toggle-verification', [UserController::class, 'toggleVerification'])->name('users.toggle-verification');

    /*
    |--------------------------------------------------------------------------
    | Role & Permission Management
    |--------------------------------------------------------------------------
    */
    Route::resource('roles', RoleController::class);
    Route::controller(RoleController::class)->prefix('permissions')->name('permissions.')->group(function () {
        Route::get('/', 'permissions')->name('index');
        Route::post('/', 'storePermission')->name('store');
        Route::patch('/{permission}', 'updatePermission')->name('update');
        Route::delete('/{permission}', 'destroyPermission')->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Vendor Management
    |--------------------------------------------------------------------------
    */
    Route::resource('vendors', VendorController::class);
    Route::controller(VendorController::class)->prefix('vendors')->name('vendors.')->group(function () {
        Route::get('/applications', 'applications')->name('applications');
        Route::patch('/{vendor}/status', 'updateStatus')->name('status');
        Route::post('/{vendor}/approve', 'approve')->name('approve');
        Route::post('/{vendor}/reject', 'reject')->name('reject');
    });

    // Vendor status updates from dashboard
    Route::patch('/vendors/{vendor}/approve', [AdminDashboardController::class, 'updateVendorStatus'])->name('vendors.approve-dashboard');

    /*
    |--------------------------------------------------------------------------
    | Product Catalog Management
    |--------------------------------------------------------------------------
    */

    // Products
    Route::resource('products', AdminProductController::class);
    Route::patch('/products/bulk-update-status', [AdminProductController::class, 'bulkUpdateStatus'])->name('products.bulk-update-status');

    // Product Images
    Route::controller(ProductImageController::class)->prefix('products/{product}/images')->name('products.images.')->group(function () {
        Route::post('/', 'store')->name('store');
        Route::delete('/{mediaId}', 'destroy')->name('destroy');
    });

    // Product Variants
    Route::resource('product-variants', ProductVariantController::class);

    // Categories
    Route::resource('categories', AdminCategoryController::class);

    // Tags
    Route::resource('tags', TagController::class);

    /*
    |--------------------------------------------------------------------------
    | Order Management
    |--------------------------------------------------------------------------
    */
    Route::controller(AdminOrderController::class)->prefix('orders')->name('orders.')->group(function () {
        // Order listing and details
        Route::get('/', 'index')->name('index');
        Route::get('/{order}', 'show')->name('show');

        // Order status management
        Route::post('/{order}/update-status', 'updateStatus')->name('update-status');
        Route::post('/{order}/mark-as-paid', 'markAsPaid')->name('mark-as-paid');
        Route::post('/{order}/cancel', 'cancelOrder')->name('cancel');
        Route::post('/{order}/complete', 'completeOrder')->name('complete');

        // COD (Cash on Delivery) workflow
        Route::post('/{order}/confirm', 'confirmOrder')->name('confirm');
        Route::post('/{order}/start-processing', 'startProcessing')->name('start-processing');
        Route::post('/{order}/assign-delivery-person', 'assignDeliveryPerson')->name('assign-delivery-person');
        Route::post('/{order}/mark-out-for-delivery', 'markOutForDelivery')->name('mark-out-for-delivery');
        Route::post('/{order}/confirm-cod-collection', 'confirmCodCollection')->name('confirm-cod-collection');
        Route::post('/{order}/handle-delivery-failure', 'handleDeliveryFailure')->name('handle-delivery-failure');
    });

    /*
    |--------------------------------------------------------------------------
    | COD Reconciliation
    |--------------------------------------------------------------------------
    */
    Route::controller(CodReconciliationController::class)->prefix('cod-reconciliation')->name('cod-reconciliation.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/export', 'export')->name('export');
        Route::post('/generate', 'generate')->name('generate');
        Route::post('/auto-verify', 'autoVerify')->name('auto-verify');
        Route::get('/delivery-person/{deliveryPerson}/summary', 'deliveryPersonSummary')->name('delivery-person-summary');
        Route::get('/{reconciliation}', 'show')->name('show');
        Route::post('/{reconciliation}/verify', 'verify')->name('verify');
        Route::post('/{reconciliation}/dispute', 'dispute')->name('dispute');
    });

    /*
    |--------------------------------------------------------------------------
    | Payout Management
    |--------------------------------------------------------------------------
    */
    Route::controller(PayoutController::class)->prefix('payouts')->name('payouts.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/export', 'export')->name('export');
        Route::get('/{payout}', 'show')->name('show');
        Route::post('/{payout}/process', 'process')->name('process');
        Route::post('/{payout}/cancel', 'cancel')->name('cancel');
        Route::post('/{payout}/retry', 'retry')->name('retry');
        Route::post('/bulk-process', 'bulkProcess')->name('bulk-process');
    });

    // Payout updates from dashboard
    Route::patch('/payouts/{payout}/process', [AdminDashboardController::class, 'updatePayoutStatus'])->name('payouts.process-dashboard');

    /*
    |--------------------------------------------------------------------------
    | Coupon Management
    |--------------------------------------------------------------------------
    */
    Route::resource('coupons', CouponController::class);
    Route::controller(CouponController::class)->prefix('coupons')->name('coupons.')->group(function () {
        Route::patch('/{coupon}/toggle-status', 'toggleStatus')->name('toggle-status');
        Route::patch('/bulk-update-status', 'bulkUpdateStatus')->name('bulk-update-status');
    });

    /*
    |--------------------------------------------------------------------------
    | Reports & Analytics
    |--------------------------------------------------------------------------
    */
    Route::controller(ReportController::class)->prefix('reports')->name('reports.')->group(function () {
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/sales', 'sales')->name('sales');
        Route::get('/orders', 'orders')->name('orders');
        Route::get('/products', 'products')->name('products');
        Route::get('/vendors', 'vendors')->name('vendors');
        Route::get('/customers', 'customers')->name('customers');
        Route::get('/export', 'export')->name('export');
        Route::post('/clear-cache', 'clearCache')->name('clear-cache');
    });

    /*
    |--------------------------------------------------------------------------
    | Platform Settings
    |--------------------------------------------------------------------------
    */
    Route::controller(SettingController::class)->prefix('settings')->name('settings.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/general', 'general')->name('general');
        Route::get('/payment', 'payment')->name('payment');
        Route::get('/shipping', 'shipping')->name('shipping');
        Route::get('/email', 'email')->name('email');
        Route::get('/vendor', 'vendor')->name('vendor');
        Route::get('/tax', 'tax')->name('tax');
        Route::post('/{group}', 'update')->name('update');
        Route::post('/email/test', 'sendTestEmail')->name('email.test');
    });

    /*
    |--------------------------------------------------------------------------
    | Email Template Management
    |--------------------------------------------------------------------------
    */
    Route::controller(EmailTemplateController::class)->prefix('email-templates')->name('email-templates.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{template}/edit', 'edit')->name('edit');
        Route::put('/{template}', 'update')->name('update');
        Route::post('/{template}/preview', 'preview')->name('preview');
        Route::post('/{template}/send-test', 'sendTest')->name('send-test');
        Route::patch('/{template}/toggle-status', 'toggleStatus')->name('toggle-status');
    });

    /*
    |--------------------------------------------------------------------------
    | Notification Management
    |--------------------------------------------------------------------------
    */
    Route::controller(AdminNotificationController::class)->prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/settings', 'updateSettings')->name('update-settings');
        Route::post('/broadcast', 'sendBroadcast')->name('broadcast');
    });

    /*
    |--------------------------------------------------------------------------
    | Activity Logs
    |--------------------------------------------------------------------------
    */
    Route::controller(ActivityLogController::class)->prefix('activity-logs')->name('activity-logs.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{activityLog}', 'show')->name('show');
    });
});

/*
|--------------------------------------------------------------------------
| 7. AUTHENTICATION ROUTES
|--------------------------------------------------------------------------
| Login, registration, password reset, email verification
*/
require __DIR__.'/auth.php';
