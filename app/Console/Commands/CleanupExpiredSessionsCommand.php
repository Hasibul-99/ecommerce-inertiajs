<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupExpiredSessionsCommand extends Command
{
    protected $signature = 'cleanup:expired-sessions';
    protected $description = 'Clean up expired sessions from the database';

    public function handle(): int
    {
        $this->info('Cleaning up expired sessions...');

        $deleted = DB::table('sessions')
            ->where('last_activity', '<', now()->subDays(7)->timestamp)
            ->delete();

        $this->info("Deleted {$deleted} expired sessions.");

        return self::SUCCESS;
    }
}
