<?php

namespace App\Services;

use App\Models\Payout;
use App\Models\VendorEarning;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayoutService
{
    /**
     * Initiate a payout (mark as processing).
     */
    public function initiatePayout(Payout $payout, ?int $processedBy = null): bool
    {
        if (!$payout->canBeProcessed()) {
            throw new \Exception('Payout cannot be processed in its current status.');
        }

        try {
            DB::beginTransaction();

            $payout->update([
                'status' => 'processing',
                'processed_by' => $processedBy,
            ]);

            activity()
                ->performedOn($payout)
                ->causedBy($processedBy)
                ->log('Payout processing initiated');

            DB::commit();

            Log::info('Payout initiated', [
                'payout_id' => $payout->id,
                'vendor_id' => $payout->vendor_id,
                'amount_cents' => $payout->amount_cents,
            ]);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to initiate payout', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Process bank transfer for a payout.
     * In a real system, this would integrate with a payment gateway.
     */
    public function processBankTransfer(Payout $payout): array
    {
        // In production, integrate with payment gateway (Stripe, PayPal, etc.)
        // For now, we'll simulate the process

        $vendor = $payout->vendor;

        // Validate bank details
        if (!$vendor->bank_account_number || !$vendor->bank_routing_number) {
            throw new \Exception('Vendor bank details are incomplete.');
        }

        try {
            // Simulate API call to payment gateway
            $transactionId = 'TXN-' . strtoupper(uniqid());
            
            // In production, you would:
            // 1. Call payment gateway API
            // 2. Wait for response
            // 3. Handle success/failure
            
            Log::info('Bank transfer simulated', [
                'payout_id' => $payout->id,
                'transaction_id' => $transactionId,
                'amount_cents' => $payout->net_amount_cents,
            ]);

            return [
                'success' => true,
                'transaction_id' => $transactionId,
                'processed_at' => now(),
                'method' => 'bank_transfer',
            ];
        } catch (\Exception $e) {
            Log::error('Bank transfer failed', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Mark a payout as paid with transaction details.
     */
    public function markAsPaid(Payout $payout, array $transactionDetails, ?int $processedBy = null): bool
    {
        if ($payout->status !== 'processing' && $payout->status !== 'pending') {
            throw new \Exception('Payout cannot be marked as paid in its current status.');
        }

        try {
            DB::beginTransaction();

            // Update payout status
            $payout->update([
                'status' => 'completed',
                'processed_at' => now(),
                'processed_by' => $processedBy,
                'payout_details' => array_merge(
                    $payout->payout_details ?? [],
                    [
                        'transaction_id' => $transactionDetails['transaction_id'] ?? null,
                        'processed_at' => $transactionDetails['processed_at'] ?? now()->toISOString(),
                        'method' => $transactionDetails['method'] ?? 'bank_transfer',
                        'notes' => $transactionDetails['notes'] ?? null,
                    ]
                ),
            ]);

            // Mark associated earnings as paid
            VendorEarning::where('vendor_id', $payout->vendor_id)
                ->where('status', 'processing')
                ->whereBetween('created_at', [$payout->period_start, $payout->period_end])
                ->update(['status' => 'paid']);

            activity()
                ->performedOn($payout)
                ->causedBy($processedBy)
                ->withProperties($transactionDetails)
                ->log('Payout marked as paid');

            DB::commit();

            Log::info('Payout marked as paid', [
                'payout_id' => $payout->id,
                'vendor_id' => $payout->vendor_id,
                'transaction_details' => $transactionDetails,
            ]);

            // Send notification to vendor
            $payout->vendor->user->notify(new \App\Notifications\PayoutCompletedNotification($payout));

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to mark payout as paid', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Cancel a payout.
     */
    public function cancelPayout(Payout $payout, string $reason, ?int $cancelledBy = null): bool
    {
        if (!$payout->canBeCancelled()) {
            throw new \Exception('Payout cannot be cancelled in its current status.');
        }

        try {
            DB::beginTransaction();

            $payout->update([
                'status' => 'cancelled',
                'cancellation_reason' => $reason,
                'cancelled_at' => now(),
                'processed_by' => $cancelledBy,
            ]);

            // Release associated earnings back to available status
            VendorEarning::where('vendor_id', $payout->vendor_id)
                ->where('status', 'processing')
                ->whereBetween('created_at', [$payout->period_start, $payout->period_end])
                ->update(['status' => 'available']);

            activity()
                ->performedOn($payout)
                ->causedBy($cancelledBy)
                ->withProperties(['reason' => $reason])
                ->log('Payout cancelled');

            DB::commit();

            Log::info('Payout cancelled', [
                'payout_id' => $payout->id,
                'vendor_id' => $payout->vendor_id,
                'reason' => $reason,
            ]);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to cancel payout', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Mark a payout as failed.
     */
    public function markAsFailed(Payout $payout, string $reason, ?int $processedBy = null): bool
    {
        try {
            DB::beginTransaction();

            $payout->update([
                'status' => 'failed',
                'cancellation_reason' => $reason,
                'processed_by' => $processedBy,
                'payout_details' => array_merge(
                    $payout->payout_details ?? [],
                    [
                        'failure_reason' => $reason,
                        'failed_at' => now()->toISOString(),
                    ]
                ),
            ]);

            // Release associated earnings back to available status
            VendorEarning::where('vendor_id', $payout->vendor_id)
                ->where('status', 'processing')
                ->whereBetween('created_at', [$payout->period_start, $payout->period_end])
                ->update(['status' => 'available']);

            activity()
                ->performedOn($payout)
                ->causedBy($processedBy)
                ->withProperties(['reason' => $reason])
                ->log('Payout failed');

            DB::commit();

            Log::warning('Payout marked as failed', [
                'payout_id' => $payout->id,
                'vendor_id' => $payout->vendor_id,
                'reason' => $reason,
            ]);

            // Notify vendor of failure
            $payout->vendor->user->notify(new \App\Notifications\PayoutFailedNotification($payout, $reason));

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to mark payout as failed', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Retry a failed payout.
     */
    public function retryPayout(Payout $payout, ?int $processedBy = null): bool
    {
        if ($payout->status !== 'failed') {
            throw new \Exception('Only failed payouts can be retried.');
        }

        try {
            DB::beginTransaction();

            // Reset status to pending
            $payout->update([
                'status' => 'pending',
                'cancellation_reason' => null,
                'processed_by' => $processedBy,
            ]);

            // Mark earnings as processing again
            VendorEarning::where('vendor_id', $payout->vendor_id)
                ->where('status', 'available')
                ->whereBetween('created_at', [$payout->period_start, $payout->period_end])
                ->update(['status' => 'processing']);

            activity()
                ->performedOn($payout)
                ->causedBy($processedBy)
                ->log('Payout retry initiated');

            DB::commit();

            Log::info('Payout retry initiated', [
                'payout_id' => $payout->id,
                'vendor_id' => $payout->vendor_id,
            ]);

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to retry payout', [
                'payout_id' => $payout->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
