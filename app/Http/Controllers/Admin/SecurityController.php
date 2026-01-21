<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlockedIp;
use App\Models\LoginAttempt;
use App\Models\SecurityEvent;
use App\Services\SecurityService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    public function __construct(
        private SecurityService $securityService
    ) {}

    /**
     * Display security event logs.
     */
    public function logs(Request $request): Response
    {
        $filters = $request->only(['type', 'user_id', 'date_from', 'date_to', 'search']);

        $query = SecurityEvent::query()
            ->with('user')
            ->latest();

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', "%{$request->search}%")
                    ->orWhere('ip', 'like', "%{$request->search}%")
                    ->orWhere('url', 'like', "%{$request->search}%");
            });
        }

        $events = $query->paginate(20)->withQueryString();

        // Get event types for filter dropdown
        $eventTypes = SecurityEvent::distinct('type')
            ->pluck('type')
            ->sort()
            ->values();

        // Get security summary
        $summary = $this->securityService->getSecuritySummary(30);

        return Inertia::render('Admin/Security/Logs', [
            'events' => $events,
            'eventTypes' => $eventTypes,
            'filters' => $filters,
            'summary' => $summary,
        ]);
    }

    /**
     * Display blocked IPs.
     */
    public function blockedIps(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $query = BlockedIp::query()
            ->with('blockedBy')
            ->latest();

        // Filter by status (active/expired)
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where(function ($q) {
                    $q->whereNull('blocked_until')
                        ->orWhere('blocked_until', '>', now());
                });
            } else {
                $query->where('blocked_until', '<=', now());
            }
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('ip', 'like', "%{$request->search}%")
                    ->orWhere('reason', 'like', "%{$request->search}%");
            });
        }

        $blockedIps = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Security/BlockedIps', [
            'blockedIps' => $blockedIps,
            'filters' => $filters,
        ]);
    }

    /**
     * Display login attempts.
     */
    public function loginAttempts(Request $request): Response
    {
        $filters = $request->only(['status', 'user_id', 'date_from', 'date_to', 'search']);

        $query = LoginAttempt::query()
            ->with('user')
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('successful', $request->status === 'successful');
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('email', 'like', "%{$request->search}%")
                    ->orWhere('ip', 'like', "%{$request->search}%")
                    ->orWhere('user_agent', 'like', "%{$request->search}%");
            });
        }

        $attempts = $query->paginate(20)->withQueryString();

        // Get statistics
        $stats = [
            'total' => LoginAttempt::count(),
            'successful' => LoginAttempt::where('successful', true)->count(),
            'failed' => LoginAttempt::where('successful', false)->count(),
            'today' => LoginAttempt::whereDate('created_at', today())->count(),
        ];

        return Inertia::render('Admin/Security/LoginAttempts', [
            'attempts' => $attempts,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    /**
     * Block an IP address.
     */
    public function blockIp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ip' => 'required|ip',
            'reason' => 'required|string|max:255',
            'duration' => 'required|integer|min:1|max:8760', // Max 1 year in hours
        ]);

        $this->securityService->blockIp(
            $validated['ip'],
            $validated['reason'],
            $validated['duration'],
            $request->user()
        );

        return redirect()
            ->route('admin.security.blocked-ips')
            ->with('success', "IP address {$validated['ip']} has been blocked.");
    }

    /**
     * Unblock an IP address.
     */
    public function unblockIp(BlockedIp $blockedIp): RedirectResponse
    {
        $this->securityService->unblockIp($blockedIp->ip);

        return redirect()
            ->route('admin.security.blocked-ips')
            ->with('success', "IP address {$blockedIp->ip} has been unblocked.");
    }

    /**
     * Delete old security events.
     */
    public function cleanupEvents(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'days' => 'required|integer|min:7|max:365',
        ]);

        $deleted = $this->securityService->cleanupOldEvents($validated['days']);

        return redirect()
            ->route('admin.security.logs')
            ->with('success', "Deleted {$deleted} security events older than {$validated['days']} days.");
    }

    /**
     * Export security logs.
     */
    public function exportLogs(Request $request)
    {
        $filters = $request->only(['type', 'date_from', 'date_to']);

        $query = SecurityEvent::query()
            ->with('user')
            ->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $events = $query->get();

        $csv = "ID,Type,User,IP,Description,URL,Created At\n";

        foreach ($events as $event) {
            $csv .= implode(',', [
                $event->id,
                $event->type,
                $event->user ? $event->user->email : 'N/A',
                $event->ip,
                '"' . str_replace('"', '""', $event->description) . '"',
                '"' . str_replace('"', '""', $event->url ?? 'N/A') . '"',
                $event->created_at->format('Y-m-d H:i:s'),
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="security-logs-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }
}
