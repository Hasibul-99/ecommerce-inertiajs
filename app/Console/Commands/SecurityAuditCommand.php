<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\BlockedIp;
use App\Models\LoginAttempt;
use App\Models\SecurityEvent;
use App\Models\User;
use App\Services\SecurityService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SecurityAuditCommand extends Command
{
    protected $signature = 'security:audit {--output=console : Output format (console, json, html)}';
    protected $description = 'Run a comprehensive security audit and generate a report';

    public function __construct(
        private SecurityService $securityService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('Running Security Audit...');
        $this->newLine();

        $report = $this->generateAuditReport();

        $outputFormat = $this->option('output');

        match ($outputFormat) {
            'json' => $this->outputJson($report),
            'html' => $this->outputHtml($report),
            default => $this->outputConsole($report),
        };

        return self::SUCCESS;
    }

    /**
     * Generate comprehensive security audit report.
     */
    private function generateAuditReport(): array
    {
        $report = [
            'timestamp' => now()->toDateTimeString(),
            'summary' => $this->getSummary(),
            'failed_logins' => $this->getFailedLoginAnalysis(),
            'blocked_ips' => $this->getBlockedIpAnalysis(),
            'suspicious_activities' => $this->getSuspiciousActivities(),
            'user_accounts' => $this->getUserAccountAnalysis(),
            'security_events' => $this->getRecentSecurityEvents(),
            'recommendations' => $this->getSecurityRecommendations(),
        ];

        return $report;
    }

    /**
     * Get security summary.
     */
    private function getSummary(): array
    {
        return $this->securityService->getSecuritySummary(30);
    }

    /**
     * Analyze failed login attempts.
     */
    private function getFailedLoginAnalysis(): array
    {
        $failedAttempts = LoginAttempt::where('successful', false)
            ->where('created_at', '>=', now()->subDays(7))
            ->get();

        $byIp = $failedAttempts->groupBy('ip')
            ->map->count()
            ->sortDesc()
            ->take(10);

        $byEmail = $failedAttempts->groupBy('email')
            ->map->count()
            ->sortDesc()
            ->take(10);

        return [
            'total' => $failedAttempts->count(),
            'unique_ips' => $failedAttempts->unique('ip')->count(),
            'unique_emails' => $failedAttempts->unique('email')->count(),
            'top_ips' => $byIp->toArray(),
            'top_emails' => $byEmail->toArray(),
        ];
    }

    /**
     * Analyze blocked IPs.
     */
    private function getBlockedIpAnalysis(): array
    {
        $total = BlockedIp::count();
        $active = BlockedIp::where(function ($q) {
            $q->whereNull('blocked_until')
                ->orWhere('blocked_until', '>', now());
        })->count();

        $recentBlocks = BlockedIp::where('created_at', '>=', now()->subDays(7))
            ->count();

        return [
            'total' => $total,
            'active' => $active,
            'expired' => $total - $active,
            'recent_blocks' => $recentBlocks,
        ];
    }

    /**
     * Get suspicious activities.
     */
    private function getSuspiciousActivities(): array
    {
        $suspiciousTypes = [
            'xss_attempt',
            'suspicious_activity',
            'rate_limit_exceeded',
            'unauthorized_access',
        ];

        $activities = SecurityEvent::whereIn('type', $suspiciousTypes)
            ->where('created_at', '>=', now()->subDays(7))
            ->get();

        $byType = $activities->groupBy('type')
            ->map->count()
            ->toArray();

        $byUser = $activities->whereNotNull('user_id')
            ->groupBy('user_id')
            ->map->count()
            ->sortDesc()
            ->take(10)
            ->toArray();

        return [
            'total' => $activities->count(),
            'by_type' => $byType,
            'by_user' => $byUser,
        ];
    }

    /**
     * Analyze user accounts.
     */
    private function getUserAccountAnalysis(): array
    {
        $totalUsers = User::count();
        $activeUsers = User::where('last_login_at', '>=', now()->subDays(30))->count();
        $lockedAccounts = DB::table('account_locks')
            ->where('locked_until', '>', now())
            ->count();

        $admins = User::role(['admin', 'super-admin'])->count();
        $vendors = User::role('vendor')->count();
        $customers = User::role('customer')->count();

        return [
            'total_users' => $totalUsers,
            'active_users_30d' => $activeUsers,
            'locked_accounts' => $lockedAccounts,
            'admins' => $admins,
            'vendors' => $vendors,
            'customers' => $customers,
        ];
    }

    /**
     * Get recent security events.
     */
    private function getRecentSecurityEvents(): array
    {
        $events = SecurityEvent::where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get(['id', 'type', 'user_id', 'ip', 'description', 'created_at'])
            ->toArray();

        return $events;
    }

    /**
     * Generate security recommendations.
     */
    private function getSecurityRecommendations(): array
    {
        $recommendations = [];

        // Check for high failed login rate
        $failedLogins = LoginAttempt::where('successful', false)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($failedLogins > 50) {
            $recommendations[] = [
                'severity' => 'high',
                'category' => 'authentication',
                'message' => "High number of failed login attempts detected ({$failedLogins} in the last hour). Consider implementing additional rate limiting.",
            ];
        }

        // Check for XSS attempts
        $xssAttempts = SecurityEvent::where('type', 'xss_attempt')
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($xssAttempts > 10) {
            $recommendations[] = [
                'severity' => 'high',
                'category' => 'input_validation',
                'message' => "Multiple XSS attempts detected ({$xssAttempts} in the last 24 hours). Review input validation and sanitization.",
            ];
        }

        // Check for locked accounts
        $lockedAccounts = DB::table('account_locks')
            ->where('locked_until', '>', now())
            ->count();

        if ($lockedAccounts > 20) {
            $recommendations[] = [
                'severity' => 'medium',
                'category' => 'account_security',
                'message' => "{$lockedAccounts} accounts are currently locked. Consider reviewing account security policies.",
            ];
        }

        // Check for old security events
        $oldEventsCount = SecurityEvent::where('created_at', '<', now()->subDays(90))->count();

        if ($oldEventsCount > 10000) {
            $recommendations[] = [
                'severity' => 'low',
                'category' => 'maintenance',
                'message' => "{$oldEventsCount} security events are older than 90 days. Consider archiving or deleting old logs.",
            ];
        }

        // Check admin account count
        $adminCount = User::role(['admin', 'super-admin'])->count();

        if ($adminCount > 5) {
            $recommendations[] = [
                'severity' => 'medium',
                'category' => 'access_control',
                'message' => "{$adminCount} admin accounts detected. Review and ensure principle of least privilege is followed.",
            ];
        }

        // If no issues found
        if (empty($recommendations)) {
            $recommendations[] = [
                'severity' => 'info',
                'category' => 'general',
                'message' => 'No critical security issues detected. Continue monitoring.',
            ];
        }

        return $recommendations;
    }

    /**
     * Output report to console.
     */
    private function outputConsole(array $report): void
    {
        $this->info('═══════════════════════════════════════════════════');
        $this->info('          SECURITY AUDIT REPORT');
        $this->info('═══════════════════════════════════════════════════');
        $this->info('Generated: ' . $report['timestamp']);
        $this->newLine();

        // Summary
        $this->info('SUMMARY (Last 30 Days)');
        $this->line('─────────────────────────────────────────────────');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Events', number_format($report['summary']['total_events'])],
                ['Failed Logins', number_format($report['summary']['failed_logins'])],
                ['XSS Attempts', number_format($report['summary']['xss_attempts'])],
                ['Suspicious Activities', number_format($report['summary']['suspicious_activities'])],
                ['Blocked IPs', number_format($report['summary']['blocked_ips'])],
            ]
        );
        $this->newLine();

        // Failed Logins
        $this->info('FAILED LOGIN ANALYSIS (Last 7 Days)');
        $this->line('─────────────────────────────────────────────────');
        $this->line('Total: ' . number_format($report['failed_logins']['total']));
        $this->line('Unique IPs: ' . number_format($report['failed_logins']['unique_ips']));
        $this->line('Unique Emails: ' . number_format($report['failed_logins']['unique_emails']));
        $this->newLine();

        // Blocked IPs
        $this->info('BLOCKED IP ADDRESSES');
        $this->line('─────────────────────────────────────────────────');
        $this->line('Total: ' . number_format($report['blocked_ips']['total']));
        $this->line('Active: ' . number_format($report['blocked_ips']['active']));
        $this->line('Expired: ' . number_format($report['blocked_ips']['expired']));
        $this->line('Recent Blocks (7d): ' . number_format($report['blocked_ips']['recent_blocks']));
        $this->newLine();

        // User Accounts
        $this->info('USER ACCOUNTS');
        $this->line('─────────────────────────────────────────────────');
        $this->table(
            ['Type', 'Count'],
            [
                ['Total Users', number_format($report['user_accounts']['total_users'])],
                ['Active (30d)', number_format($report['user_accounts']['active_users_30d'])],
                ['Locked Accounts', number_format($report['user_accounts']['locked_accounts'])],
                ['Admins', number_format($report['user_accounts']['admins'])],
                ['Vendors', number_format($report['user_accounts']['vendors'])],
                ['Customers', number_format($report['user_accounts']['customers'])],
            ]
        );
        $this->newLine();

        // Recommendations
        $this->info('SECURITY RECOMMENDATIONS');
        $this->line('═══════════════════════════════════════════════════');
        foreach ($report['recommendations'] as $rec) {
            $severity = strtoupper($rec['severity']);
            $color = match ($rec['severity']) {
                'high' => 'error',
                'medium' => 'warn',
                'low' => 'info',
                default => 'line',
            };

            $this->$color("[{$severity}] {$rec['category']}: {$rec['message']}");
        }
        $this->newLine();

        $this->info('═══════════════════════════════════════════════════');
        $this->info('End of Security Audit Report');
        $this->info('═══════════════════════════════════════════════════');
    }

    /**
     * Output report as JSON.
     */
    private function outputJson(array $report): void
    {
        $this->line(json_encode($report, JSON_PRETTY_PRINT));
    }

    /**
     * Output report as HTML.
     */
    private function outputHtml(array $report): void
    {
        $filename = storage_path('app/security-audit-' . now()->format('Y-m-d-His') . '.html');

        $html = view('reports.security-audit', ['report' => $report])->render();

        file_put_contents($filename, $html);

        $this->info("HTML report generated: {$filename}");
    }
}
