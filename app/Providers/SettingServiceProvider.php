<?php

namespace App\Providers;

use App\Services\SettingService;
use Illuminate\Support\ServiceProvider;

class SettingServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('settings', function ($app) {
            return new SettingService();
        });

        $this->app->alias('settings', SettingService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
