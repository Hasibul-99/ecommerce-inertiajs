<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PerformanceMonitor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage();

        $response = $next($request);

        $executionTime = (microtime(true) - $startTime) * 1000; // Convert to milliseconds
        $memoryUsed = (memory_get_usage() - $startMemory) / 1024 / 1024; // Convert to MB

        // Log slow requests (> 1 second)
        if ($executionTime > 1000) {
            Log::warning('Slow request detected', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'execution_time_ms' => round($executionTime, 2),
                'memory_used_mb' => round($memoryUsed, 2),
                'user_id' => $request->user()?->id,
                'ip' => $request->ip(),
            ]);
        }

        // Add performance headers in development
        if (config('app.debug')) {
            $response->headers->set('X-Execution-Time', round($executionTime, 2) . 'ms');
            $response->headers->set('X-Memory-Used', round($memoryUsed, 2) . 'MB');
            $response->headers->set('X-Memory-Peak', round(memory_get_peak_usage() / 1024 / 1024, 2) . 'MB');
        }

        return $response;
    }
}
