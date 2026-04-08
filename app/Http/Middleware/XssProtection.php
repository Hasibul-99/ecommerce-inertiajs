<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\SecurityService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class XssProtection
{
    public function __construct(
        private SecurityService $securityService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        if ($this->containsSuspiciousInput($input)) {
            // Log XSS attempt
            $this->securityService->logSecurityEvent(
                'xss_attempt',
                ['input' => $this->sanitizeForLogging($input)],
                $request->user(),
                'Potential XSS attempt detected in request input'
            );
        }

        // Sanitize input
        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                $value = $this->sanitizeInput($value);
            }
        });

        $request->merge($input);

        return $next($request);
    }

    /**
     * Check if input contains suspicious patterns.
     */
    private function containsSuspiciousInput(array $input): bool
    {
        $patterns = [
            '/<script[^>]*>.*?<\/script>/is',
            '/javascript:/i',
            '/on\w+\s*=/i', // Event handlers like onclick=
            '/<iframe/i',
            '/<object/i',
            '/<embed/i',
        ];

        $inputString = json_encode($input);

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $inputString)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Sanitize input string.
     */
    private function sanitizeInput(string $value): string
    {
        // Only sanitize if not excluded
        // You might want to exclude certain fields like 'password'
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    /**
     * Sanitize data for logging (remove sensitive information).
     */
    private function sanitizeForLogging(array $data): array
    {
        $sensitiveFields = ['password', 'password_confirmation', 'token', 'api_key'];

        array_walk_recursive($data, function (&$value, $key) use ($sensitiveFields) {
            if (in_array($key, $sensitiveFields)) {
                $value = '[REDACTED]';
            }
        });

        return $data;
    }
}
