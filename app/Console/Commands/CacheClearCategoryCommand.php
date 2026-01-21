<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\CacheService;
use Illuminate\Console\Command;

class CacheClearCategoryCommand extends Command
{
    protected $signature = 'cache:clear-category {id : The category ID}';
    protected $description = 'Clear cache for a specific category';

    public function __construct(
        private CacheService $cacheService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $categoryId = (int) $this->argument('id');

        $this->info("Clearing cache for category #{$categoryId}...");

        $this->cacheService->clearCategoryCache($categoryId);

        $this->info('Category cache cleared successfully!');

        return self::SUCCESS;
    }
}
