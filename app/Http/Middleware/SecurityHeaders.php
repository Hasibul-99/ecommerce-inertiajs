<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Content Security Policy (CSP)
        $csp = $this->getContentSecurityPolicy();
        $response->headers->set('Content-Security-Policy', $csp);

        // HTTP Strict Transport Security (HSTS)
        // Force HTTPS for 1 year, including subdomains
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // X-Frame-Options - Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // X-Content-Type-Options - Prevent MIME sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // X-XSS-Protection - Enable XSS filtering
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer-Policy - Control referrer information
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions-Policy - Control browser features
        $permissionsPolicy = [
            'geolocation=(self)',
            'microphone=()',
            'camera=()',
            'payment=(self)',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
        ];
        $response->headers->set('Permissions-Policy', implode(', ', $permissionsPolicy));

        // Remove server signature
        $response->headers->remove('X-Powered-By');
        $response->headers->set('Server', '');

        return $response;
    }

    /**
     * Get Content Security Policy directives.
     */
    private function getContentSecurityPolicy(): string
    {
        $directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://api.stripe.com",
            "frame-src 'self' https://js.stripe.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "upgrade-insecure-requests",
        ];

        // In development, allow eval for better debugging
        if (config('app.debug')) {
            $directives[] = "script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com";
        }

        return implode('; ', $directives);
    }
}
