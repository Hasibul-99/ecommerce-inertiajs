<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\CacheService;
use Illuminate\Console\Command;

class CacheClearProductCommand extends Command
{
    protected $signature = 'cache:clear-product {id : The product ID}';
    protected $description = 'Clear cache for a specific product';

    public function __construct(
        private CacheService $cacheService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $productId = (int) $this->argument('id');

        $this->info("Clearing cache for product #{$productId}...");

        $this->cacheService->clearProductCache($productId);

        $this->info('Product cache cleared successfully!');

        return self::SUCCESS;
    }
}
