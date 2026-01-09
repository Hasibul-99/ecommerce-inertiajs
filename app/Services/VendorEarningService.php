<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\Vendor;
use App\Models\VendorEarning;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VendorEarningService
{
    /**
     * Calculate earnings for a vendor within a date range.
     */
    public function calculateEarnings(Vendor $vendor, Carbon $from, Carbon $to): array
    {
        $earnings = VendorEarning::where('vendor_id', $vendor->id)
            ->whereBetween('created_at', [$from, $to])
            ->get();

        $totalGross = $earnings->sum('amount_cents');
        $totalCommission = $earnings->sum('commission_cents');
        $totalNet = $earnings->sum('net_amount_cents');

        // Group by status
        $byStatus = [
            'pending' => $earnings->where('status', 'pending')->sum('net_amount_cents'),
            'available' => $earnings->where('status', 'available')->sum('net_amount_cents'),
            'withheld' => $earnings->where('status', 'withheld')->sum('net_amount_cents'),
            'paid' => $earnings->where('status', 'paid')->sum('net_amount_cents'),
        ];

        // Group by day for charts
        $dailyEarnings = $earnings->groupBy(function ($earning) {
            return $earning->created_at->format('Y-m-d');
        })->map(function ($dayEarnings) {
            return [
                'gross' => $dayEarnings->sum('amount_cents'),
                'commission' => $dayEarnings->sum('commission_cents'),
                'net' => $dayEarnings->sum('net_amount_cents'),
                'count' => $dayEarnings->count(),
            ];
        });

        return [
            'total_gross_cents' => $totalGross,
            'total_commission_cents' => $totalCommission,
            'total_net_cents' => $totalNet,
            'by_status' => $byStatus,
            'daily_earnings' => $dailyEarnings,
            'transactions_count' => $earnings->count(),
        ];
    }

    /**
     * Get available balance for a vendor (ready for payout).
     */
    public function getAvailableBalance(Vendor $vendor): int
    {
        return VendorEarning::where('vendor_id', $vendor->id)
            ->available()
            ->sum('net_amount_cents');
    }

    /**
     * Get pending balance for a vendor (orders not yet delivered).
     */
    public function getPendingBalance(Vendor $vendor): int
    {
        return VendorEarning::where('vendor_id', $vendor->id)
            ->pending()
            ->sum('net_amount_cents');
    }

    /**
     * Get withheld balance for a vendor (refund reserve).
     */
    public function getWithheldBalance(Vendor $vendor): int
    {
        return VendorEarning::where('vendor_id', $vendor->id)
            ->withheld()
            ->sum('net_amount_cents');
    }

    /**
     * Create a payout request for a vendor.
     */
    public function createPayoutRequest(Vendor $vendor, int $amountCents, ?int $requestedBy = null): Payout
    {
        $availableBalance = $this->getAvailableBalance($vendor);

        if ($amountCents > $availableBalance) {
            throw new \Exception('Requested amount exceeds available balance.');
        }

        if ($amountCents < config('payout.minimum_amount_cents', 1000)) {
            throw new \Exception('Requested amount is below minimum payout amount.');
        }

        try {
            DB::beginTransaction();

            // Calculate processing fee (e.g., 2% or fixed amount)
            $processingFeeCents = $this->calculateProcessingFee($amountCents);
            $netAmountCents = $amountCents - $processingFeeCents;

            // Get earnings to include in this payout
            $earnings = VendorEarning::where('vendor_id', $vendor->id)
                ->available()
                ->orderBy('available_at', 'asc')
                ->get();

            $remainingAmount = $amountCents;
            $itemsCount = 0;
            $periodStart = null;
            $periodEnd = null;

            foreach ($earnings as $earning) {
                if ($remainingAmount <= 0) {
                    break;
                }

                if ($earning->net_amount_cents <= $remainingAmount) {
                    // Include entire earning
                    $earning->update(['status' => 'processing']);
                    $remainingAmount -= $earning->net_amount_cents;
                    $itemsCount++;

                    if (!$periodStart || $earning->created_at < $periodStart) {
                        $periodStart = $earning->created_at;
                    }
                    if (!$periodEnd || $earning->created_at > $periodEnd) {
                        $periodEnd = $earning->created_at;
                    }
                }
            }

            // Create payout
            $payout = Payout::create([
                'vendor_id' => $vendor->id,
                'payout_id' => 'PO-' . strtoupper(uniqid()),
                'period_start' => $periodStart,
                'period_end' => $periodEnd,
                'items_count' => $itemsCount,
                'amount_cents' => $amountCents,
                'processing_fee_cents' => $processingFeeCents,
                'net_amount_cents' => $netAmountCents,
                'status' => 'pending',
                'payment_method' => 'bank_transfer',
                'payout_method' => 'bank_transfer',
                'payout_details' => [
                    'bank_name' => $vendor->bank_name,
                    'bank_account_name' => $vendor->bank_account_name,
                    'bank_account_number' => substr($vendor->bank_account_number, -4), // Last 4 digits only
                ],
                'requested_by' => $requestedBy,
            ]);

            activity()
                ->performedOn($payout)
                ->causedBy($requestedBy)
                ->withProperties([
                    'amount_cents' => $amountCents,
                    'vendor_id' => $vendor->id,
                ])
                ->log('Payout requested');

            DB::commit();

            return $payout;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create payout request', [
                'vendor_id' => $vendor->id,
                'amount_cents' => $amountCents,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Process automatic payout for a vendor (weekly/monthly).
     */
    public function processAutomaticPayout(Vendor $vendor): ?Payout
    {
        $availableBalance = $this->getAvailableBalance($vendor);
        $minimumAmount = config('payout.minimum_amount_cents', 1000);

        // Check if vendor has enough balance
        if ($availableBalance < $minimumAmount) {
            Log::info('Vendor does not have sufficient balance for automatic payout', [
                'vendor_id' => $vendor->id,
                'available_balance' => $availableBalance,
                'minimum_amount' => $minimumAmount,
            ]);
            return null;
        }

        // Check if vendor has automatic payouts enabled
        if (!$vendor->settings()->where('key', 'auto_payout_enabled')->value('value')) {
            return null;
        }

        try {
            $payout = $this->createPayoutRequest($vendor, $availableBalance, null);

            Log::info('Automatic payout created', [
                'vendor_id' => $vendor->id,
                'payout_id' => $payout->id,
                'amount_cents' => $availableBalance,
            ]);

            return $payout;
        } catch (\Exception $e) {
            Log::error('Failed to process automatic payout', [
                'vendor_id' => $vendor->id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Record earnings from a delivered order.
     */
    public function recordEarnings(Order $order): void
    {
        try {
            DB::beginTransaction();

            // Get all vendor items from this order
            $vendorItems = OrderItem::where('order_id', $order->id)
                ->whereNotNull('vendor_id')
                ->with('vendor')
                ->get()
                ->groupBy('vendor_id');

            foreach ($vendorItems as $vendorId => $items) {
                $vendor = $items->first()->vendor;

                if (!$vendor) {
                    continue;
                }

                $grossAmount = $items->sum(function ($item) {
                    return $item->price_at_purchase_cents * $item->quantity;
                });

                // Calculate commission
                $commissionRate = $vendor->commission_percent ?? 10.0;
                $commissionCents = (int) ($grossAmount * ($commissionRate / 100));
                $netAmountCents = $grossAmount - $commissionCents;

                // Determine when funds will be available (e.g., 7 days after delivery)
                $availableAt = now()->addDays(config('payout.hold_period_days', 7));

                // Create earning record
                VendorEarning::create([
                    'vendor_id' => $vendorId,
                    'order_id' => $order->id,
                    'amount_cents' => $grossAmount,
                    'commission_cents' => $commissionCents,
                    'net_amount_cents' => $netAmountCents,
                    'status' => 'pending',
                    'available_at' => $availableAt,
                ]);

                Log::info('Earnings recorded for vendor', [
                    'vendor_id' => $vendorId,
                    'order_id' => $order->id,
                    'gross_amount' => $grossAmount,
                    'commission' => $commissionCents,
                    'net_amount' => $netAmountCents,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to record earnings', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Make pending earnings available for payout.
     */
    public function makeEarningsAvailable(): int
    {
        $count = VendorEarning::where('status', 'pending')
            ->where('available_at', '<=', now())
            ->update(['status' => 'available']);

        Log::info("Made {$count} earnings available for payout");

        return $count;
    }

    /**
     * Calculate processing fee for a payout amount.
     */
    protected function calculateProcessingFee(int $amountCents): int
    {
        $feeType = config('payout.fee_type', 'percentage'); // 'percentage' or 'fixed'

        if ($feeType === 'percentage') {
            $feePercent = config('payout.fee_percentage', 2.0);
            return (int) ($amountCents * ($feePercent / 100));
        } else {
            return config('payout.fee_fixed_cents', 100);
        }
    }
}
