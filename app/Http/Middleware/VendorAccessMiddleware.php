<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Services\SecurityService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VendorAccessMiddleware
{
    public function __construct(
        private SecurityService $securityService
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Check if user has vendor role
        if (!$user->hasRole('vendor')) {
            $this->securityService->logSecurityEvent(
                'unauthorized_vendor_access',
                ['url' => $request->fullUrl()],
                $user,
                "User {$user->email} attempted to access vendor area without vendor role"
            );

            abort(403, 'You do not have permission to access the vendor area.');
        }

        // Check if user has a vendor profile
        if (!$user->vendor) {
            $this->securityService->logSecurityEvent(
                'vendor_profile_missing',
                ['url' => $request->fullUrl()],
                $user,
                "User {$user->email} has vendor role but no vendor profile"
            );

            return redirect()
                ->route('vendor.onboarding')
                ->with('error', 'Please complete your vendor profile to access this area.');
        }

        // Check vendor status
        if ($user->vendor->status === 'pending') {
            return redirect()
                ->route('vendor.pending')
                ->with('info', 'Your vendor application is pending approval.');
        }

        if ($user->vendor->status === 'rejected') {
            $this->securityService->logSecurityEvent(
                'rejected_vendor_access',
                [
                    'vendor_id' => $user->vendor->id,
                    'url' => $request->fullUrl(),
                ],
                $user,
                "Rejected vendor {$user->vendor->business_name} attempted access"
            );

            return redirect()
                ->route('vendor.rejected')
                ->with('error', 'Your vendor application has been rejected.');
        }

        if ($user->vendor->status === 'suspended') {
            $this->securityService->logSecurityEvent(
                'suspended_vendor_access',
                [
                    'vendor_id' => $user->vendor->id,
                    'url' => $request->fullUrl(),
                ],
                $user,
                "Suspended vendor {$user->vendor->business_name} attempted access"
            );

            return redirect()
                ->route('vendor.suspended')
                ->with('error', 'Your vendor account has been suspended. Please contact support.');
        }

        if ($user->vendor->status !== 'approved') {
            abort(403, 'Your vendor account status does not allow access.');
        }

        return $next($request);
    }
}
