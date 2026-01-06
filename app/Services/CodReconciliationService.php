<?php

namespace App\Services;

use App\Models\CodReconciliation;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CodReconciliationService
{
    /**
     * Generate daily reconciliation report for a specific date.
     *
     * @param Carbon $date
     * @param User|null $deliveryPerson
     * @return array
     */
    public function generateDailyReport(Carbon $date, ?User $deliveryPerson = null): array
    {
        try {
            DB::beginTransaction();

            $reconciliations = [];

            // Get all delivery persons who collected COD on this date
            $deliveryPersonQuery = Order::where('payment_method', 'cod')
                ->whereDate('cod_collected_at', $date)
                ->whereNotNull('cod_collected_at')
                ->whereNotNull('delivery_person_id')
                ->distinct()
                ->pluck('delivery_person_id');

            // Filter by specific delivery person if provided
            if ($deliveryPerson) {
                $deliveryPersonIds = collect([$deliveryPerson->id]);
            } else {
                $deliveryPersonIds = $deliveryPersonQuery;
            }

            foreach ($deliveryPersonIds as $deliveryPersonId) {
                // Check if reconciliation already exists
                $existing = CodReconciliation::where('date', $date->toDateString())
                    ->where('delivery_person_id', $deliveryPersonId)
                    ->first();

                if ($existing) {
                    Log::info('Reconciliation already exists', [
                        'date' => $date->toDateString(),
                        'delivery_person_id' => $deliveryPersonId,
                    ]);
                    continue;
                }

                // Get all COD orders collected by this person on this date
                $orders = Order::where('payment_method', 'cod')
                    ->where('delivery_person_id', $deliveryPersonId)
                    ->whereDate('cod_collected_at', $date)
                    ->whereNotNull('cod_collected_at')
                    ->get();

                if ($orders->isEmpty()) {
                    continue;
                }

                $totalOrders = $orders->count();
                $totalCodAmount = $orders->sum('total_cents');
                $collectedAmount = $orders->sum('cod_amount_collected');

                // Create reconciliation record
                $reconciliation = CodReconciliation::create([
                    'date' => $date->toDateString(),
                    'delivery_person_id' => $deliveryPersonId,
                    'total_orders_count' => $totalOrders,
                    'total_cod_amount_cents' => $totalCodAmount,
                    'collected_amount_cents' => $collectedAmount,
                    'discrepancy_cents' => $collectedAmount - $totalCodAmount,
                    'status' => 'pending',
                    'metadata' => [
                        'order_ids' => $orders->pluck('id')->toArray(),
                        'generated_at' => now()->toDateTimeString(),
                        'generated_by' => Auth::id(),
                    ],
                ]);

                $reconciliations[] = $reconciliation;

                // Log activity
                ActivityLogService::log(
                    'generated',
                    'cod_reconciliation',
                    $reconciliation,
                    [
                        'date' => $date->toDateString(),
                        'delivery_person_id' => $deliveryPersonId,
                        'total_orders' => $totalOrders,
                        'total_amount' => $totalCodAmount,
                    ]
                );
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Daily reconciliation report generated successfully.',
                'reconciliations' => $reconciliations,
                'count' => count($reconciliations),
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to generate daily reconciliation report', [
                'date' => $date->toDateString(),
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to generate report: ' . $e->getMessage(),
                'reconciliations' => [],
                'count' => 0,
            ];
        }
    }

    /**
     * Verify a COD collection reconciliation.
     *
     * @param CodReconciliation $reconciliation
     * @param int $actualAmount
     * @param string|null $notes
     * @return array
     */
    public function verifyCollection(CodReconciliation $reconciliation, int $actualAmount, ?string $notes = null): array
    {
        try {
            DB::beginTransaction();

            $discrepancy = $actualAmount - $reconciliation->total_cod_amount_cents;

            $reconciliation->update([
                'collected_amount_cents' => $actualAmount,
                'discrepancy_cents' => $discrepancy,
                'status' => abs($discrepancy) > 0 ? 'disputed' : 'verified',
                'verified_by' => Auth::id(),
                'verified_at' => now(),
                'notes' => $notes,
                'metadata' => array_merge($reconciliation->metadata ?? [], [
                    'verification' => [
                        'actual_amount_cents' => $actualAmount,
                        'discrepancy_cents' => $discrepancy,
                        'verified_at' => now()->toDateTimeString(),
                        'verified_by' => Auth::id(),
                        'notes' => $notes,
                    ],
                ]),
            ]);

            // Log activity
            ActivityLogService::log(
                'verified',
                'cod_reconciliation',
                $reconciliation,
                [
                    'actual_amount' => $actualAmount,
                    'discrepancy' => $discrepancy,
                    'status' => $reconciliation->status,
                ]
            );

            DB::commit();

            $message = abs($discrepancy) > 0
                ? 'Collection verified with discrepancy of $' . abs($discrepancy / 100) . '. Status set to disputed.'
                : 'Collection verified successfully with no discrepancy.';

            return [
                'success' => true,
                'message' => $message,
                'reconciliation' => $reconciliation->fresh(),
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to verify COD collection', [
                'reconciliation_id' => $reconciliation->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to verify collection: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Handle discrepancy in COD collection.
     *
     * @param CodReconciliation $reconciliation
     * @param string $reason
     * @param string|null $resolution
     * @return array
     */
    public function handleDiscrepancy(CodReconciliation $reconciliation, string $reason, ?string $resolution = null): array
    {
        try {
            DB::beginTransaction();

            $status = $resolution ? 'resolved' : 'disputed';

            $reconciliation->update([
                'status' => $status,
                'notes' => $reconciliation->notes . "\n\nDiscrepancy Reason: " . $reason .
                    ($resolution ? "\n\nResolution: " . $resolution : ''),
                'metadata' => array_merge($reconciliation->metadata ?? [], [
                    'discrepancy_handling' => [
                        'reason' => $reason,
                        'resolution' => $resolution,
                        'handled_at' => now()->toDateTimeString(),
                        'handled_by' => Auth::id(),
                        'previous_status' => $reconciliation->getOriginal('status'),
                    ],
                ]),
            ]);

            // Log activity
            ActivityLogService::log(
                'discrepancy_handled',
                'cod_reconciliation',
                $reconciliation,
                [
                    'reason' => $reason,
                    'resolution' => $resolution,
                    'status' => $status,
                ]
            );

            DB::commit();

            return [
                'success' => true,
                'message' => $resolution
                    ? 'Discrepancy resolved successfully.'
                    : 'Discrepancy recorded and marked as disputed.',
                'reconciliation' => $reconciliation->fresh(),
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to handle discrepancy', [
                'reconciliation_id' => $reconciliation->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to handle discrepancy: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get delivery person summary for a date range.
     *
     * @param User $deliveryPerson
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array
     */
    public function getDeliveryPersonSummary(User $deliveryPerson, Carbon $startDate, Carbon $endDate): array
    {
        // Get all reconciliations for this person in date range
        $reconciliations = CodReconciliation::where('delivery_person_id', $deliveryPerson->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->get();

        // Get all COD orders for this person in date range
        $orders = Order::where('payment_method', 'cod')
            ->where('delivery_person_id', $deliveryPerson->id)
            ->whereNotNull('cod_collected_at')
            ->whereBetween('cod_collected_at', [$startDate, $endDate])
            ->get();

        $totalOrders = $orders->count();
        $totalExpectedAmount = $orders->sum('total_cents');
        $totalCollectedAmount = $orders->sum('cod_amount_collected');
        $totalDiscrepancy = $totalCollectedAmount - $totalExpectedAmount;

        // Calculate statistics
        $verifiedCount = $reconciliations->where('status', 'verified')->count();
        $disputedCount = $reconciliations->where('status', 'disputed')->count();
        $pendingCount = $reconciliations->where('status', 'pending')->count();

        $accuracyPercentage = $totalExpectedAmount > 0
            ? ($totalCollectedAmount / $totalExpectedAmount) * 100
            : 100;

        // Get daily breakdown
        $dailyBreakdown = $reconciliations->map(function ($reconciliation) {
            return [
                'date' => $reconciliation->date->toDateString(),
                'orders_count' => $reconciliation->total_orders_count,
                'expected_amount' => $reconciliation->total_cod_amount_cents,
                'collected_amount' => $reconciliation->collected_amount_cents,
                'discrepancy' => $reconciliation->discrepancy_cents,
                'status' => $reconciliation->status,
            ];
        });

        return [
            'delivery_person' => [
                'id' => $deliveryPerson->id,
                'name' => $deliveryPerson->name,
                'email' => $deliveryPerson->email,
            ],
            'date_range' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
                'days' => $startDate->diffInDays($endDate) + 1,
            ],
            'summary' => [
                'total_orders' => $totalOrders,
                'total_expected_amount_cents' => $totalExpectedAmount,
                'total_collected_amount_cents' => $totalCollectedAmount,
                'total_discrepancy_cents' => $totalDiscrepancy,
                'accuracy_percentage' => round($accuracyPercentage, 2),
            ],
            'reconciliation_status' => [
                'verified' => $verifiedCount,
                'disputed' => $disputedCount,
                'pending' => $pendingCount,
                'total' => $reconciliations->count(),
            ],
            'daily_breakdown' => $dailyBreakdown,
        ];
    }

    /**
     * Get overall COD statistics for admin dashboard.
     *
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array
     */
    public function getOverallStatistics(Carbon $startDate, Carbon $endDate): array
    {
        $reconciliations = CodReconciliation::whereBetween('date', [$startDate, $endDate])->get();

        $totalReconciliations = $reconciliations->count();
        $totalOrders = $reconciliations->sum('total_orders_count');
        $totalExpected = $reconciliations->sum('total_cod_amount_cents');
        $totalCollected = $reconciliations->sum('collected_amount_cents');
        $totalDiscrepancy = $reconciliations->sum('discrepancy_cents');

        $verified = $reconciliations->where('status', 'verified')->count();
        $disputed = $reconciliations->where('status', 'disputed')->count();
        $pending = $reconciliations->where('status', 'pending')->count();

        $accuracyRate = $totalExpected > 0 ? ($totalCollected / $totalExpected) * 100 : 100;

        return [
            'date_range' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
            'totals' => [
                'reconciliations' => $totalReconciliations,
                'orders' => $totalOrders,
                'expected_amount_cents' => $totalExpected,
                'collected_amount_cents' => $totalCollected,
                'discrepancy_cents' => $totalDiscrepancy,
                'accuracy_percentage' => round($accuracyRate, 2),
            ],
            'status_breakdown' => [
                'verified' => $verified,
                'disputed' => $disputed,
                'pending' => $pending,
            ],
        ];
    }

    /**
     * Auto-verify reconciliations with zero discrepancy.
     *
     * @return array
     */
    public function autoVerifyZeroDiscrepancy(): array
    {
        $reconciliations = CodReconciliation::where('status', 'pending')
            ->where('discrepancy_cents', 0)
            ->get();

        $count = 0;
        foreach ($reconciliations as $reconciliation) {
            $reconciliation->update([
                'status' => 'verified',
                'verified_by' => null, // Auto-verified
                'verified_at' => now(),
                'notes' => 'Auto-verified: Zero discrepancy',
            ]);
            $count++;
        }

        return [
            'success' => true,
            'message' => "Auto-verified {$count} reconciliations with zero discrepancy.",
            'count' => $count,
        ];
    }
}
