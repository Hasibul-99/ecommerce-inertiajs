<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Generate COD daily reconciliation report at 11:30 PM every day
        $schedule->command('cod:generate-daily-report --auto-verify')
            ->dailyAt('23:30')
            ->timezone('UTC')
            ->onSuccess(function () {
                \Log::info('COD daily report generated successfully');
            })
            ->onFailure(function () {
                \Log::error('COD daily report generation failed');
            });
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
