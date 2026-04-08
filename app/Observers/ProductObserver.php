<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Product;
use App\Services\CacheService;

class ProductObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the Product "saved" event.
     */
    public function saved(Product $product): void
    {
        $this->cacheService->clearProductCache($product->id);

        if ($product->is_featured || $product->wasChanged('is_featured')) {
            $this->cacheService->clearHomepageCache();
        }
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $this->cacheService->clearProductCache($product->id);
        $this->cacheService->clearHomepageCache();
    }
}
