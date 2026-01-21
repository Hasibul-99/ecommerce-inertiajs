<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\AccountLocked;
use App\Events\SuspiciousActivityDetected;
use App\Models\AccountLock;
use App\Models\BlockedIp;
use App\Models\LoginAttempt;
use App\Models\SecurityEvent;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SecurityService
{
    // Constants
    public const MAX_LOGIN_ATTEMPTS = 5;
    public const LOCKOUT_DURATION_MINUTES = 30;
    public const FAILED_ATTEMPT_WINDOW_MINUTES = 15;

    /**
     * Log a security event.
     */
    public function logSecurityEvent(
        string $type,
        array $data = [],
        ?User $user = null,
        ?string $description = null
    ): SecurityEvent {
        return SecurityEvent::create([
            'user_id' => $user?->id,
            'ip' => request()->ip(),
            'type' => $type,
            'description' => $description,
            'data' => $data,
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
        ]);
    }

    /**
     * Track login attempt.
     */
    public function trackLoginAttempt(
        string $email,
        bool $successful,
        array $metadata = []
    ): LoginAttempt {
        return LoginAttempt::create([
            'email' => $email,
            'ip' => request()->ip(),
            'successful' => $successful,
            'user_agent' => request()->userAgent(),
            'metadata' => $metadata,
        ]);
    }

    /**
     * Check if account should be locked after failed login.
     */
    public function checkAndLockAccount(string $email): ?AccountLock
    {
        $recentFailedAttempts = LoginAttempt::where('email', $email)
            ->where('successful', false)
            ->where('created_at', '>=', now()->subMinutes(self::FAILED_ATTEMPT_WINDOW_MINUTES))
            ->count();

        if ($recentFailedAttempts >= self::MAX_LOGIN_ATTEMPTS) {
            $user = User::where('email', $email)->first();

            if ($user) {
                $lock = AccountLock::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'reason' => 'Too many failed login attempts',
                        'locked_until' => now()->addMinutes(self::LOCKOUT_DURATION_MINUTES),
                        'failed_attempts' => $recentFailedAttempts,
                    ]
                );

                // Log security event
                $this->logSecurityEvent(
                    'account_locked',
                    ['failed_attempts' => $recentFailedAttempts],
                    $user,
                    'Account locked due to multiple failed login attempts'
                );

                // Dispatch event
                event(new AccountLocked($user, $recentFailedAttempts));

                return $lock;
            }
        }

        return null;
    }

    /**
     * Check if account is currently locked.
     */
    public function isAccountLocked(User $user): bool
    {
        $lock = AccountLock::where('user_id', $user->id)
            ->where('locked_until', '>', now())
            ->first();

        return $lock !== null;
    }

    /**
     * Unlock an account.
     */
    public function unlockAccount(User $user): void
    {
        AccountLock::where('user_id', $user->id)->delete();

        $this->logSecurityEvent(
            'account_unlocked',
            [],
            $user,
            'Account manually unlocked'
        );
    }

    /**
     * Detect suspicious activity for a user.
     */
    public function detectSuspiciousActivity(User $user): bool
    {
        // Check for rapid login attempts from different IPs
        $recentLogins = LoginAttempt::where('email', $user->email)
            ->where('created_at', '>=', now()->subHour())
            ->where('successful', true)
            ->get();

        $uniqueIps = $recentLogins->pluck('ip')->unique();

        // More than 3 different IPs in an hour is suspicious
        if ($uniqueIps->count() > 3) {
            $this->logSecurityEvent(
                'suspicious_activity',
                ['unique_ips' => $uniqueIps->toArray()],
                $user,
                'Multiple IPs detected within short timeframe'
            );

            event(new SuspiciousActivityDetected($user, 'multiple_ips'));

            return true;
        }

        // Check for unusual login times
        // Add your custom logic here

        return false;
    }

    /**
     * Block an IP address.
     */
    public function blockIp(
        string $ip,
        string $reason,
        int $hours = 0, // 0 = permanent
        ?User $blockedBy = null
    ): BlockedIp {
        $blockedUntil = $hours > 0 ? now()->addHours($hours) : null;

        $blockedIp = BlockedIp::updateOrCreate(
            ['ip' => $ip],
            [
                'reason' => $reason,
                'blocked_until' => $blockedUntil,
                'created_by' => $blockedBy?->id,
            ]
        );

        $this->logSecurityEvent(
            'ip_blocked',
            [
                'ip' => $ip,
                'reason' => $reason,
                'duration_hours' => $hours,
            ],
            $blockedBy,
            "IP {$ip} blocked: {$reason}"
        );

        return $blockedIp;
    }

    /**
     * Check if an IP is blocked.
     */
    public function isIpBlocked(string $ip): bool
    {
        $blocked = BlockedIp::where('ip', $ip)
            ->where(function ($query) {
                $query->whereNull('blocked_until')
                    ->orWhere('blocked_until', '>', now());
            })
            ->exists();

        return $blocked;
    }

    /**
     * Unblock an IP address.
     */
    public function unblockIp(string $ip, ?User $unblockedBy = null): void
    {
        BlockedIp::where('ip', $ip)->delete();

        $this->logSecurityEvent(
            'ip_unblocked',
            ['ip' => $ip],
            $unblockedBy,
            "IP {$ip} unblocked"
        );
    }

    /**
     * Clean up old security events (older than specified days).
     */
    public function cleanupOldEvents(int $days = 90): int
    {
        return SecurityEvent::where('created_at', '<', now()->subDays($days))
            ->delete();
    }

    /**
     * Clean up expired IP blocks.
     */
    public function cleanupExpiredBlocks(): int
    {
        return BlockedIp::whereNotNull('blocked_until')
            ->where('blocked_until', '<', now())
            ->delete();
    }

    /**
     * Get security summary for dashboard.
     */
    public function getSecuritySummary(int $days = 7): array
    {
        $since = now()->subDays($days);

        return [
            'total_events' => SecurityEvent::where('created_at', '>=', $since)->count(),
            'failed_logins' => LoginAttempt::where('created_at', '>=', $since)
                ->where('successful', false)
                ->count(),
            'successful_logins' => LoginAttempt::where('created_at', '>=', $since)
                ->where('successful', true)
                ->count(),
            'locked_accounts' => AccountLock::where('locked_until', '>', now())->count(),
            'blocked_ips' => BlockedIp::where(function ($q) {
                $q->whereNull('blocked_until')
                    ->orWhere('blocked_until', '>', now());
            })->count(),
            'suspicious_activities' => SecurityEvent::where('created_at', '>=', $since)
                ->where('type', 'suspicious_activity')
                ->count(),
        ];
    }
}
