<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Services\CacheService;
use Illuminate\Console\Command;

class CacheWarmCommand extends Command
{
    protected $signature = 'cache:warm';
    protected $description = 'Warm up cache with frequently accessed data';

    public function __construct(
        private CacheService $cacheService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Starting cache warmup...');

        $this->warmCategories();
        $this->warmHomepageData();
        $this->warmSettings();

        $this->info('Cache warmup completed successfully!');

        return self::SUCCESS;
    }

    private function warmCategories(): void
    {
        $this->info('Caching categories...');

        $this->cacheService->cacheCategories(function () {
            return Category::with('children')
                ->whereNull('parent_id')
                ->orderBy('order')
                ->get();
        });

        $this->line('✓ Categories cached');
    }

    private function warmHomepageData(): void
    {
        $this->info('Caching homepage data...');

        // Featured products
        $this->cacheService->cacheHomepage('featured_products', function () {
            return Product::where('is_featured', true)
                ->where('status', 'active')
                ->with(['vendor', 'media', 'category'])
                ->limit(8)
                ->get();
        });

        // Deal products
        $this->cacheService->cacheHomepage('deal_products', function () {
            return Product::where('status', 'active')
                ->where('sale_price', '>', 0)
                ->with(['vendor', 'media', 'category'])
                ->limit(8)
                ->get();
        });

        // New products
        $this->cacheService->cacheHomepage('new_products', function () {
            return Product::where('status', 'active')
                ->with(['vendor', 'media', 'category'])
                ->latest()
                ->limit(8)
                ->get();
        });

        $this->line('✓ Homepage data cached');
    }

    private function warmSettings(): void
    {
        $this->info('Caching settings...');

        // Settings are already cached by SettingService
        // Just trigger the cache
        settings()->getAllCached();

        $this->line('✓ Settings cached');
    }
}
