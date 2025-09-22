<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/products', function () {
    return Inertia::render('Products', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/product/{id}', function ($id) {
    return Inertia::render('Product/Detail', [
        'productId' => $id
    ]);
})->name('product.detail');

Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->name('checkout');

Route::get('/wishlist', function () {
    return Inertia::render('Wishlist/Index');
})->name('wishlist');

Route::get('/compare', function () {
    return Inertia::render('Compare');
})->name('compare');

Route::get('/category', function () {
    return Inertia::render('Category/Index');
})->name('category');

Route::get('/about-us', function () {
    return Inertia::render('AboutUs/Index');
})->name('about-us');

Route::get('/contact-us', function () {
    return Inertia::render('ContactUs/Index');
})->name('contact-us');

Route::post('/contact-us', function () {
    // Handle contact form submission
    return redirect()->back()->with('success', 'Your message has been sent!');
})->name('contact.submit');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
