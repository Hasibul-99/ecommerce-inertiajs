<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\VendorEarning;
use App\Services\VendorEarningService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EarningsController extends Controller
{
    protected $earningService;

    public function __construct(VendorEarningService $earningService)
    {
        $this->middleware(['auth', 'verified', 'role:vendor']);
        $this->earningService = $earningService;
    }

    /**
     * Display earnings dashboard with overview and charts.
     */
    public function dashboard(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.register')
                ->with('error', 'Please complete vendor registration first.');
        }

        // Get balance summary
        $availableBalance = $this->earningService->getAvailableBalance($vendor);
        $pendingBalance = $this->earningService->getPendingBalance($vendor);
        $withheldBalance = $this->earningService->getWithheldBalance($vendor);
        $totalBalance = $availableBalance + $pendingBalance + $withheldBalance;

        // Get earnings for last 30 days
        $from = Carbon::now()->subDays(30);
        $to = Carbon::now();
        $earningsData = $this->earningService->calculateEarnings($vendor, $from, $to);

        // Recent transactions
        $recentTransactions = VendorEarning::where('vendor_id', $vendor->id)
            ->with('order')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($earning) {
                return [
                    'id' => $earning->id,
                    'order_id' => $earning->order_id,
                    'order_number' => $earning->order->order_number,
                    'amount_cents' => $earning->amount_cents,
                    'commission_cents' => $earning->commission_cents,
                    'net_amount_cents' => $earning->net_amount_cents,
                    'status' => $earning->status,
                    'available_at' => $earning->available_at?->format('Y-m-d H:i:s'),
                    'created_at' => $earning->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Recent payouts
        $recentPayouts = Payout::where('vendor_id', $vendor->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($payout) {
                return [
                    'id' => $payout->id,
                    'payout_id' => $payout->payout_id,
                    'amount_cents' => $payout->amount_cents,
                    'net_amount_cents' => $payout->net_amount_cents,
                    'status' => $payout->status,
                    'created_at' => $payout->created_at->format('Y-m-d H:i:s'),
                    'processed_at' => $payout->processed_at?->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Vendor/Earnings/Index', [
            'balances' => [
                'available_cents' => $availableBalance,
                'pending_cents' => $pendingBalance,
                'withheld_cents' => $withheldBalance,
                'total_cents' => $totalBalance,
            ],
            'earningsData' => $earningsData,
            'recentTransactions' => $recentTransactions,
            'recentPayouts' => $recentPayouts,
            'minimumPayoutCents' => config('payout.minimum_amount_cents', 1000),
            'canRequestPayout' => $availableBalance >= config('payout.minimum_amount_cents', 1000),
        ]);
    }

    /**
     * Display full transaction history with filters.
     */
    public function transactions(Request $request)
    {
        $vendor = Auth::user()->vendor;

        $query = VendorEarning::where('vendor_id', $vendor->id)
            ->with('order');

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by order number
        if ($request->search) {
            $query->whereHas('order', function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%");
            });
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $transactions->getCollection()->transform(function ($earning) {
            return [
                'id' => $earning->id,
                'order_id' => $earning->order_id,
                'order_number' => $earning->order->order_number,
                'amount_cents' => $earning->amount_cents,
                'commission_cents' => $earning->commission_cents,
                'net_amount_cents' => $earning->net_amount_cents,
                'status' => $earning->status,
                'available_at' => $earning->available_at?->format('Y-m-d H:i:s'),
                'created_at' => $earning->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Stats
        $stats = [
            'total_earnings' => VendorEarning::where('vendor_id', $vendor->id)->sum('net_amount_cents'),
            'total_transactions' => VendorEarning::where('vendor_id', $vendor->id)->count(),
            'available' => VendorEarning::where('vendor_id', $vendor->id)->where('status', 'available')->sum('net_amount_cents'),
            'pending' => VendorEarning::where('vendor_id', $vendor->id)->where('status', 'pending')->sum('net_amount_cents'),
        ];

        return Inertia::render('Vendor/Earnings/Transactions', [
            'transactions' => $transactions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display payout history.
     */
    public function payouts(Request $request)
    {
        $vendor = Auth::user()->vendor;

        $query = Payout::where('vendor_id', $vendor->id);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $payouts = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $payouts->getCollection()->transform(function ($payout) {
            return [
                'id' => $payout->id,
                'payout_id' => $payout->payout_id,
                'period_start' => $payout->period_start?->format('Y-m-d'),
                'period_end' => $payout->period_end?->format('Y-m-d'),
                'items_count' => $payout->items_count,
                'amount_cents' => $payout->amount_cents,
                'processing_fee_cents' => $payout->processing_fee_cents,
                'net_amount_cents' => $payout->net_amount_cents,
                'status' => $payout->status,
                'payment_method' => $payout->payment_method,
                'created_at' => $payout->created_at->format('Y-m-d H:i:s'),
                'processed_at' => $payout->processed_at?->format('Y-m-d H:i:s'),
            ];
        });

        // Stats
        $stats = [
            'total_payouts' => Payout::where('vendor_id', $vendor->id)->count(),
            'total_paid' => Payout::where('vendor_id', $vendor->id)->completed()->sum('net_amount_cents'),
            'pending_count' => Payout::where('vendor_id', $vendor->id)->pending()->count(),
            'pending_amount' => Payout::where('vendor_id', $vendor->id)->pending()->sum('net_amount_cents'),
        ];

        return Inertia::render('Vendor/Earnings/Payouts', [
            'payouts' => $payouts,
            'stats' => $stats,
            'filters' => $request->only(['status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Request a payout.
     */
    public function requestPayout(Request $request)
    {
        $vendor = Auth::user()->vendor;

        $request->validate([
            'amount_cents' => 'required|integer|min:' . config('payout.minimum_amount_cents', 1000),
        ]);

        try {
            $payout = $this->earningService->createPayoutRequest(
                $vendor,
                $request->amount_cents,
                Auth::id()
            );

            return redirect()->route('vendor.earnings.payout-details', $payout->id)
                ->with('success', 'Payout request submitted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display details of a specific payout.
     */
    public function payoutDetails(Payout $payout)
    {
        $vendor = Auth::user()->vendor;

        // Verify vendor owns this payout
        if ($payout->vendor_id !== $vendor->id) {
            abort(404, 'Payout not found.');
        }

        $payout->load(['requester', 'processor']);

        $payoutData = [
            'id' => $payout->id,
            'payout_id' => $payout->payout_id,
            'period_start' => $payout->period_start?->format('Y-m-d H:i:s'),
            'period_end' => $payout->period_end?->format('Y-m-d H:i:s'),
            'items_count' => $payout->items_count,
            'amount_cents' => $payout->amount_cents,
            'processing_fee_cents' => $payout->processing_fee_cents,
            'net_amount_cents' => $payout->net_amount_cents,
            'status' => $payout->status,
            'payment_method' => $payout->payment_method,
            'payout_method' => $payout->payout_method,
            'payout_details' => $payout->payout_details,
            'cancellation_reason' => $payout->cancellation_reason,
            'created_at' => $payout->created_at->format('Y-m-d H:i:s'),
            'processed_at' => $payout->processed_at?->format('Y-m-d H:i:s'),
            'cancelled_at' => $payout->cancelled_at?->format('Y-m-d H:i:s'),
            'requester' => $payout->requester ? [
                'id' => $payout->requester->id,
                'name' => $payout->requester->name,
            ] : null,
            'processor' => $payout->processor ? [
                'id' => $payout->processor->id,
                'name' => $payout->processor->name,
            ] : null,
        ];

        return Inertia::render('Vendor/Earnings/PayoutDetails', [
            'payout' => $payoutData,
        ]);
    }

    /**
     * Export transactions to CSV.
     */
    public function exportTransactions(Request $request)
    {
        $vendor = Auth::user()->vendor;

        $query = VendorEarning::where('vendor_id', $vendor->id)
            ->with('order');

        // Apply same filters as transactions method
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'vendor_earnings_' . $vendor->id . '_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'Transaction ID',
                'Order Number',
                'Gross Amount',
                'Commission',
                'Net Amount',
                'Status',
                'Available At',
                'Created At',
            ]);

            // CSV Data
            foreach ($transactions as $earning) {
                fputcsv($file, [
                    $earning->id,
                    $earning->order->order_number,
                    number_format($earning->amount_cents / 100, 2),
                    number_format($earning->commission_cents / 100, 2),
                    number_format($earning->net_amount_cents / 100, 2),
                    $earning->status,
                    $earning->available_at?->format('Y-m-d H:i:s') ?? 'N/A',
                    $earning->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        activity()
            ->causedBy(Auth::user())
            ->log('Vendor exported earnings transactions');

        return response()->stream($callback, 200, $headers);
    }
}
