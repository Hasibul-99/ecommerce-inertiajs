<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\ActivityLog;
use Illuminate\Console\Command;

class CleanupOldActivityLogsCommand extends Command
{
    protected $signature = 'cleanup:old-activity-logs {--days=90 : Number of days to keep}';
    protected $description = 'Clean up old activity logs';

    public function handle(): int
    {
        $days = (int) $this->option('days');

        $this->info("Cleaning up activity logs older than {$days} days...");

        $deleted = ActivityLog::where('created_at', '<', now()->subDays($days))
            ->delete();

        $this->info("Deleted {$deleted} old activity log entries.");

        return self::SUCCESS;
    }
}
