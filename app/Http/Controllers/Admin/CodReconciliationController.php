<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CodReconciliation;
use App\Models\User;
use App\Services\CodReconciliationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CodReconciliationController extends Controller
{
    protected CodReconciliationService $reconciliationService;

    public function __construct(CodReconciliationService $reconciliationService)
    {
        $this->reconciliationService = $reconciliationService;
    }

    /**
     * Display a listing of COD reconciliations.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = CodReconciliation::query()
            ->with(['deliveryPerson', 'verifiedBy'])
            ->orderBy('date', 'desc');

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('date', '<=', $request->end_date);
        }

        // Filter by delivery person
        if ($request->has('delivery_person_id') && $request->delivery_person_id) {
            $query->where('delivery_person_id', $request->delivery_person_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $reconciliations = $query->paginate(20)->withQueryString();

        // Get delivery persons for filter dropdown
        $deliveryPersons = User::whereHas('roles', function ($q) {
            $q->where('name', 'delivery_person');
        })->get(['id', 'name', 'email']);

        // If no specific delivery role exists, get users who have delivered orders
        if ($deliveryPersons->isEmpty()) {
            $deliveryPersons = User::whereIn('id', function ($query) {
                $query->select('delivery_person_id')
                    ->from('orders')
                    ->whereNotNull('delivery_person_id')
                    ->distinct();
            })->get(['id', 'name', 'email']);
        }

        // Get statistics for the current filter
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();
        $statistics = $this->reconciliationService->getOverallStatistics($startDate, $endDate);

        return Inertia::render('Admin/CodReconciliation/Index', [
            'reconciliations' => $reconciliations,
            'deliveryPersons' => $deliveryPersons,
            'filters' => $request->only(['start_date', 'end_date', 'delivery_person_id', 'status']),
            'statistics' => $statistics,
            'statuses' => [
                ['value' => 'pending', 'label' => 'Pending'],
                ['value' => 'verified', 'label' => 'Verified'],
                ['value' => 'disputed', 'label' => 'Disputed'],
                ['value' => 'resolved', 'label' => 'Resolved'],
            ],
        ]);
    }

    /**
     * Display the specified COD reconciliation.
     *
     * @param CodReconciliation $reconciliation
     * @return \Inertia\Response
     */
    public function show(CodReconciliation $reconciliation)
    {
        $reconciliation->load(['deliveryPerson', 'verifiedBy']);

        // Get all orders for this reconciliation
        $orders = $reconciliation->orders()->with(['user', 'shippingAddress'])->get();

        return Inertia::render('Admin/CodReconciliation/Show', [
            'reconciliation' => $reconciliation,
            'orders' => $orders,
        ]);
    }

    /**
     * Verify a COD reconciliation.
     *
     * @param Request $request
     * @param CodReconciliation $reconciliation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(Request $request, CodReconciliation $reconciliation)
    {
        $request->validate([
            'actual_amount_cents' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $result = $this->reconciliationService->verifyCollection(
            $reconciliation,
            $request->actual_amount_cents,
            $request->notes
        );

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Mark a reconciliation as disputed and handle the discrepancy.
     *
     * @param Request $request
     * @param CodReconciliation $reconciliation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function dispute(Request $request, CodReconciliation $reconciliation)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
            'resolution' => 'nullable|string|max:1000',
        ]);

        $result = $this->reconciliationService->handleDiscrepancy(
            $reconciliation,
            $request->reason,
            $request->resolution
        );

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Generate daily reconciliation report.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function generate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'delivery_person_id' => 'nullable|exists:users,id',
        ]);

        $date = Carbon::parse($request->date);
        $deliveryPerson = $request->delivery_person_id
            ? User::find($request->delivery_person_id)
            : null;

        $result = $this->reconciliationService->generateDailyReport($date, $deliveryPerson);

        if ($result['success']) {
            return redirect()->route('admin.cod-reconciliation.index')
                ->with('success', $result['message'] . " ({$result['count']} reports generated)");
        }

        return redirect()->back()->with('error', $result['message']);
    }

    /**
     * Get delivery person summary.
     *
     * @param Request $request
     * @param User $deliveryPerson
     * @return \Illuminate\Http\JsonResponse
     */
    public function deliveryPersonSummary(Request $request, User $deliveryPerson)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $summary = $this->reconciliationService->getDeliveryPersonSummary(
            $deliveryPerson,
            $startDate,
            $endDate
        );

        return response()->json($summary);
    }

    /**
     * Auto-verify reconciliations with zero discrepancy.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function autoVerify()
    {
        $result = $this->reconciliationService->autoVerifyZeroDiscrepancy();

        return redirect()->back()->with('success', $result['message']);
    }

    /**
     * Export reconciliations to CSV.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(Request $request)
    {
        $query = CodReconciliation::query()
            ->with(['deliveryPerson', 'verifiedBy'])
            ->orderBy('date', 'desc');

        // Apply same filters as index
        if ($request->has('start_date') && $request->start_date) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('date', '<=', $request->end_date);
        }

        if ($request->has('delivery_person_id') && $request->delivery_person_id) {
            $query->where('delivery_person_id', $request->delivery_person_id);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $reconciliations = $query->get();

        $filename = 'cod_reconciliation_' . now()->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($reconciliations) {
            $file = fopen('php://output', 'w');

            // Header row
            fputcsv($file, [
                'Date',
                'Delivery Person',
                'Total Orders',
                'Expected Amount',
                'Collected Amount',
                'Discrepancy',
                'Status',
                'Verified By',
                'Verified At',
            ]);

            // Data rows
            foreach ($reconciliations as $reconciliation) {
                fputcsv($file, [
                    $reconciliation->date->toDateString(),
                    $reconciliation->deliveryPerson->name ?? 'N/A',
                    $reconciliation->total_orders_count,
                    '$' . number_format($reconciliation->total_cod_amount_cents / 100, 2),
                    '$' . number_format($reconciliation->collected_amount_cents / 100, 2),
                    '$' . number_format($reconciliation->discrepancy_cents / 100, 2),
                    $reconciliation->status,
                    $reconciliation->verifiedBy->name ?? 'N/A',
                    $reconciliation->verified_at ? $reconciliation->verified_at->toDateTimeString() : 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
