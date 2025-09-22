<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get total GMV (Gross Merchandise Value)
        $totalGmv = Order::where('status', 'completed')
            ->sum('total_cents');

        // Get active vendors count
        $activeVendors = Vendor::where('status', 'approved')->count();

        // Get pending vendors count
        $pendingVendors = Vendor::where('status', 'pending')->count();

        // Get pending payouts count
        $pendingPayouts = Payout::where('status', 'pending')->count();

        // Get pending vendor approvals
        $pendingVendorApprovals = Vendor::where('status', 'pending')
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        // Get pending payout requests
        $pendingPayoutRequests = Payout::where('status', 'pending')
            ->with('vendor')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalGmv' => $totalGmv / 100, // Convert to dollars
                'activeVendors' => $activeVendors,
                'pendingVendors' => $pendingVendors,
                'pendingPayouts' => $pendingPayouts,
            ],
            'pendingVendorApprovals' => $pendingVendorApprovals,
            'pendingPayoutRequests' => $pendingPayoutRequests,
        ]);
    }

    /**
     * Update vendor status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Vendor  $vendor
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateVendorStatus(Request $request, Vendor $vendor)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $vendor->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Vendor status updated successfully.');
    }

    /**
     * Update payout status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payout  $payout
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePayoutStatus(Request $request, Payout $payout)
    {
        $request->validate([
            'status' => 'required|in:processed,rejected',
        ]);

        $payout->update([
            'status' => $request->status,
            'processed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Payout status updated successfully.');
    }
}