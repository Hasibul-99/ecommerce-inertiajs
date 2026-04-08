<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Services\PayoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PayoutController extends Controller
{
    protected $payoutService;

    public function __construct(PayoutService $payoutService)
    {
        $this->middleware(['auth', 'verified', 'role:admin|super-admin']);
        $this->payoutService = $payoutService;
    }

    /**
     * Display listing of all payouts with filters.
     */
    public function index(Request $request)
    {
        $query = Payout::with(['vendor', 'requester']);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by vendor
        if ($request->vendor_id) {
            $query->where('vendor_id', $request->vendor_id);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by payout ID or vendor name
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('payout_id', 'like', "%{$request->search}%")
                  ->orWhereHas('vendor', function ($vendorQuery) use ($request) {
                      $vendorQuery->where('business_name', 'like', "%{$request->search}%");
                  });
            });
        }

        // Sort
        $sortField = $request->sort_field ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        $payouts = $query->paginate(20)->withQueryString();

        $payouts->getCollection()->transform(function ($payout) {
            return [
                'id' => $payout->id,
                'payout_id' => $payout->payout_id,
                'vendor' => [
                    'id' => $payout->vendor->id,
                    'business_name' => $payout->vendor->business_name,
                ],
                'amount_cents' => $payout->amount_cents,
                'processing_fee_cents' => $payout->processing_fee_cents,
                'net_amount_cents' => $payout->net_amount_cents,
                'status' => $payout->status,
                'payment_method' => $payout->payment_method,
                'items_count' => $payout->items_count,
                'created_at' => $payout->created_at->format('Y-m-d H:i:s'),
                'processed_at' => $payout->processed_at?->format('Y-m-d H:i:s'),
                'requester' => $payout->requester ? [
                    'id' => $payout->requester->id,
                    'name' => $payout->requester->name,
                ] : null,
            ];
        });

        // Calculate statistics
        $stats = [
            'total_pending' => Payout::pending()->count(),
            'total_pending_amount' => Payout::pending()->sum('net_amount_cents'),
            'total_processing' => Payout::processing()->count(),
            'total_completed' => Payout::completed()->count(),
            'total_completed_amount' => Payout::completed()->sum('net_amount_cents'),
            'total_failed' => Payout::failed()->count(),
        ];

        return Inertia::render('Admin/Payouts/Index', [
            'payouts' => $payouts,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'vendor_id', 'date_from', 'date_to', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Display a specific payout.
     */
    public function show(Payout $payout)
    {
        $payout->load(['vendor', 'requester', 'processor']);

        $payoutData = [
            'id' => $payout->id,
            'payout_id' => $payout->payout_id,
            'vendor' => [
                'id' => $payout->vendor->id,
                'business_name' => $payout->vendor->business_name,
                'email' => $payout->vendor->user->email,
                'phone' => $payout->vendor->phone,
                'bank_name' => $payout->vendor->bank_name,
                'bank_account_name' => $payout->vendor->bank_account_name,
            ],
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
            'can_be_processed' => $payout->canBeProcessed(),
            'can_be_cancelled' => $payout->canBeCancelled(),
        ];

        return Inertia::render('Admin/Payouts/Show', [
            'payout' => $payoutData,
        ]);
    }

    /**
     * Process a single payout.
     */
    public function process(Request $request, Payout $payout)
    {
        $request->validate([
            'transaction_id' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            // Initiate payout
            $this->payoutService->initiatePayout($payout, Auth::id());

            // Process bank transfer (or other payment method)
            if ($payout->payout_method === 'bank_transfer') {
                $transactionDetails = $this->payoutService->processBankTransfer($payout);
            } else {
                // Handle other payment methods
                $transactionDetails = [
                    'transaction_id' => $request->transaction_id,
                    'processed_at' => now(),
                    'method' => $payout->payout_method,
                ];
            }

            // Add admin notes if provided
            if ($request->notes) {
                $transactionDetails['notes'] = $request->notes;
            }

            // Mark as paid
            $this->payoutService->markAsPaid($payout, $transactionDetails, Auth::id());

            return redirect()->back()
                ->with('success', 'Payout processed successfully.');
        } catch (\Exception $e) {
            // If something fails, mark as failed
            try {
                $this->payoutService->markAsFailed($payout, $e->getMessage(), Auth::id());
            } catch (\Exception $failException) {
                // Log but don't throw
            }

            return redirect()->back()
                ->with('error', 'Failed to process payout: ' . $e->getMessage());
        }
    }

    /**
     * Process multiple payouts at once.
     */
    public function bulkProcess(Request $request)
    {
        $request->validate([
            'payout_ids' => 'required|array',
            'payout_ids.*' => 'required|exists:payouts,id',
        ]);

        $processed = 0;
        $failed = 0;
        $errors = [];

        DB::transaction(function () use ($request, &$processed, &$failed, &$errors) {
            foreach ($request->payout_ids as $payoutId) {
                try {
                    $payout = Payout::findOrFail($payoutId);

                    if (!$payout->canBeProcessed()) {
                        $failed++;
                        $errors[] = "Payout {$payout->payout_id} cannot be processed in its current status.";
                        continue;
                    }

                    // Initiate payout
                    $this->payoutService->initiatePayout($payout, Auth::id());

                    // Process based on payment method
                    if ($payout->payout_method === 'bank_transfer') {
                        $transactionDetails = $this->payoutService->processBankTransfer($payout);
                    } else {
                        $transactionDetails = [
                            'transaction_id' => 'BULK-' . strtoupper(uniqid()),
                            'processed_at' => now(),
                            'method' => $payout->payout_method,
                        ];
                    }

                    // Mark as paid
                    $this->payoutService->markAsPaid($payout, $transactionDetails, Auth::id());

                    $processed++;
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = "Payout {$payout->payout_id}: " . $e->getMessage();

                    // Mark as failed
                    try {
                        $this->payoutService->markAsFailed($payout, $e->getMessage(), Auth::id());
                    } catch (\Exception $failException) {
                        // Log but continue
                    }
                }
            }
        });

        activity()
            ->causedBy(Auth::user())
            ->withProperties([
                'processed' => $processed,
                'failed' => $failed,
                'total' => count($request->payout_ids),
            ])
            ->log('Bulk payout processing');

        $message = "Processed {$processed} payouts successfully.";
        if ($failed > 0) {
            $message .= " {$failed} payouts failed.";
        }

        return redirect()->back()
            ->with($failed > 0 ? 'warning' : 'success', $message)
            ->with('errors', $errors);
    }

    /**
     * Cancel a payout.
     */
    public function cancel(Request $request, Payout $payout)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            $this->payoutService->cancelPayout($payout, $request->reason, Auth::id());

            return redirect()->back()
                ->with('success', 'Payout cancelled successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to cancel payout: ' . $e->getMessage());
        }
    }

    /**
     * Retry a failed payout.
     */
    public function retry(Payout $payout)
    {
        try {
            $this->payoutService->retryPayout($payout, Auth::id());

            return redirect()->back()
                ->with('success', 'Payout retry initiated. You can now process it.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to retry payout: ' . $e->getMessage());
        }
    }

    /**
     * Export payouts to CSV.
     */
    public function export(Request $request)
    {
        $query = Payout::with(['vendor']);

        // Apply same filters as index
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->vendor_id) {
            $query->where('vendor_id', $request->vendor_id);
        }
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $payouts = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'payouts_export_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($payouts) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'Payout ID',
                'Vendor',
                'Period Start',
                'Period End',
                'Items Count',
                'Gross Amount',
                'Processing Fee',
                'Net Amount',
                'Status',
                'Payment Method',
                'Created At',
                'Processed At',
            ]);

            // CSV Data
            foreach ($payouts as $payout) {
                fputcsv($file, [
                    $payout->payout_id,
                    $payout->vendor->business_name,
                    $payout->period_start?->format('Y-m-d') ?? 'N/A',
                    $payout->period_end?->format('Y-m-d') ?? 'N/A',
                    $payout->items_count,
                    number_format($payout->amount_cents / 100, 2),
                    number_format($payout->processing_fee_cents / 100, 2),
                    number_format($payout->net_amount_cents / 100, 2),
                    $payout->status,
                    $payout->payment_method,
                    $payout->created_at->format('Y-m-d H:i:s'),
                    $payout->processed_at?->format('Y-m-d H:i:s') ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        activity()
            ->causedBy(Auth::user())
            ->log('Admin exported payouts');

        return response()->stream($callback, 200, $headers);
    }
}
