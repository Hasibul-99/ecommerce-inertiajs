<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Product;
use App\Observers\CategoryObserver;
use App\Observers\ProductObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register CacheService as singleton
        $this->app->singleton(\App\Services\CacheService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model observers for automatic cache invalidation
        Category::observe(CategoryObserver::class);
        Product::observe(ProductObserver::class);
    }
}
