<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Category;
use App\Services\CacheService;

class CategoryObserver
{
    public function __construct(
        private CacheService $cacheService
    ) {}

    /**
     * Handle the Category "saved" event.
     */
    public function saved(Category $category): void
    {
        $this->cacheService->clearCategoriesCache();
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleted(Category $category): void
    {
        $this->cacheService->clearCategoriesCache();
    }
}
