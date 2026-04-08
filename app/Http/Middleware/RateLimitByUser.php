<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\SecurityService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class RateLimitByUser
{
    public function __construct(
        private SecurityService $securityService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, int $maxAttempts = 60, int $decayMinutes = 1): Response
    {
        if (!$request->user()) {
            return $next($request);
        }

        $key = $this->resolveRequestSignature($request);
        $attempts = Cache::get($key, 0);

        if ($attempts >= $maxAttempts) {
            // Log rate limit violation
            $this->securityService->logSecurityEvent(
                'rate_limit_exceeded',
                [
                    'max_attempts' => $maxAttempts,
                    'decay_minutes' => $decayMinutes,
                    'endpoint' => $request->path(),
                ],
                $request->user(),
                "Rate limit exceeded for user {$request->user()->email}"
            );

            return response()->json([
                'message' => 'Too many requests. Please slow down.',
            ], 429);
        }

        // Increment attempts
        Cache::put($key, $attempts + 1, now()->addMinutes($decayMinutes));

        $response = $next($request);

        // Add rate limit headers
        $response->headers->set('X-RateLimit-Limit', (string) $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', (string) ($maxAttempts - $attempts - 1));

        return $response;
    }

    /**
     * Resolve request signature for caching.
     */
    protected function resolveRequestSignature(Request $request): string
    {
        return 'rate_limit:' . $request->user()->id . ':' . $request->path();
    }
}
