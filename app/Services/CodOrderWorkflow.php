<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderStatus as OrderStatusModel;
use App\Enums\OrderStatus;
use App\Events\CodOrderConfirmed;
use App\Events\CodOrderOutForDelivery;
use App\Events\CodPaymentCollected;
use App\Events\CodDeliveryFailed;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CodOrderWorkflow
{
    /**
     * Confirm a COD order.
     *
     * @param Order $order
     * @param string|null $comment
     * @return array
     */
    public function confirmOrder(Order $order, ?string $comment = null): array
    {
        if (!$order->isCod()) {
            return [
                'success' => false,
                'message' => 'This is not a COD order.',
            ];
        }

        if ($order->status !== OrderStatus::PENDING->value) {
            return [
                'success' => false,
                'message' => 'Order can only be confirmed from pending status.',
            ];
        }

        try {
            DB::beginTransaction();

            // Update order status
            $order->update([
                'status' => OrderStatus::CONFIRMED->value,
            ]);

            // Log status change
            $this->logStatusChange($order, OrderStatus::CONFIRMED->value, $comment ?? 'Order confirmed and ready for processing');

            // Log activity
            ActivityLogService::log(
                'confirmed',
                'cod_order',
                $order,
                [
                    'previous_status' => OrderStatus::PENDING->value,
                    'new_status' => OrderStatus::CONFIRMED->value,
                    'comment' => $comment,
                ]
            );

            DB::commit();

            // Dispatch event
            event(new CodOrderConfirmed($order));

            return [
                'success' => true,
                'message' => 'Order confirmed successfully.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to confirm order: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Move order to processing status.
     *
     * @param Order $order
     * @param string|null $comment
     * @return array
     */
    public function startProcessing(Order $order, ?string $comment = null): array
    {
        if (!$order->isCod()) {
            return [
                'success' => false,
                'message' => 'This is not a COD order.',
            ];
        }

        if ($order->status !== OrderStatus::CONFIRMED->value) {
            return [
                'success' => false,
                'message' => 'Order must be confirmed before processing.',
            ];
        }

        try {
            DB::beginTransaction();

            $order->update([
                'status' => OrderStatus::PROCESSING->value,
                'fulfillment_status' => 'preparing',
            ]);

            $this->logStatusChange($order, OrderStatus::PROCESSING->value, $comment ?? 'Order is being prepared for delivery');

            ActivityLogService::log(
                'processing',
                'cod_order',
                $order,
                [
                    'previous_status' => OrderStatus::CONFIRMED->value,
                    'new_status' => OrderStatus::PROCESSING->value,
                    'comment' => $comment,
                ]
            );

            DB::commit();

            return [
                'success' => true,
                'message' => 'Order moved to processing.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to process order: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Mark order as out for delivery and assign delivery person.
     *
     * @param Order $order
     * @param int $deliveryPersonId
     * @param string|null $comment
     * @return array
     */
    public function markOutForDelivery(Order $order, int $deliveryPersonId, ?string $comment = null): array
    {
        if (!$order->isCod()) {
            return [
                'success' => false,
                'message' => 'This is not a COD order.',
            ];
        }

        if ($order->status !== OrderStatus::PROCESSING->value) {
            return [
                'success' => false,
                'message' => 'Order must be in processing status.',
            ];
        }

        try {
            DB::beginTransaction();

            $order->update([
                'status' => OrderStatus::OUT_FOR_DELIVERY->value,
                'delivery_person_id' => $deliveryPersonId,
                'fulfillment_status' => 'out_for_delivery',
            ]);

            $this->logStatusChange(
                $order,
                OrderStatus::OUT_FOR_DELIVERY->value,
                $comment ?? 'Order is out for delivery with assigned delivery person'
            );

            ActivityLogService::log(
                'out_for_delivery',
                'cod_order',
                $order,
                [
                    'previous_status' => OrderStatus::PROCESSING->value,
                    'new_status' => OrderStatus::OUT_FOR_DELIVERY->value,
                    'delivery_person_id' => $deliveryPersonId,
                    'comment' => $comment,
                ]
            );

            DB::commit();

            // Dispatch event
            event(new CodOrderOutForDelivery($order));

            return [
                'success' => true,
                'message' => 'Order marked as out for delivery.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to mark order out for delivery: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Confirm COD payment collection and mark order as delivered.
     *
     * @param Order $order
     * @param int $amountCollectedCents
     * @param int|null $collectedBy
     * @param string|null $comment
     * @return array
     */
    public function confirmCodCollection(Order $order, int $amountCollectedCents, ?int $collectedBy = null, ?string $comment = null): array
    {
        if (!$order->isCod()) {
            return [
                'success' => false,
                'message' => 'This is not a COD order.',
            ];
        }

        if ($order->status !== OrderStatus::OUT_FOR_DELIVERY->value) {
            return [
                'success' => false,
                'message' => 'Order must be out for delivery to collect payment.',
            ];
        }

        try {
            DB::beginTransaction();

            // Mark COD as collected
            $order->markCodCollected($amountCollectedCents, $collectedBy ?? Auth::id());

            // Update order status to delivered
            $order->update([
                'status' => OrderStatus::DELIVERED->value,
                'fulfillment_status' => 'delivered',
            ]);

            $this->logStatusChange(
                $order,
                OrderStatus::DELIVERED->value,
                $comment ?? 'Order delivered and COD payment collected: $' . ($amountCollectedCents / 100)
            );

            ActivityLogService::log(
                'cod_collected',
                'cod_order',
                $order,
                [
                    'previous_status' => OrderStatus::OUT_FOR_DELIVERY->value,
                    'new_status' => OrderStatus::DELIVERED->value,
                    'amount_collected_cents' => $amountCollectedCents,
                    'collected_by' => $collectedBy ?? Auth::id(),
                    'comment' => $comment,
                ]
            );

            DB::commit();

            // Dispatch event
            event(new CodPaymentCollected($order));

            return [
                'success' => true,
                'message' => 'COD payment collected and order delivered successfully.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to confirm COD collection: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Handle delivery failure.
     *
     * @param Order $order
     * @param string $reason
     * @param int $attemptNumber
     * @param bool $reschedule
     * @return array
     */
    public function handleDeliveryFailure(Order $order, string $reason, int $attemptNumber = 1, bool $reschedule = true): array
    {
        if (!$order->isCod()) {
            return [
                'success' => false,
                'message' => 'This is not a COD order.',
            ];
        }

        if ($order->status !== OrderStatus::OUT_FOR_DELIVERY->value) {
            return [
                'success' => false,
                'message' => 'Order must be out for delivery to mark as failed.',
            ];
        }

        try {
            DB::beginTransaction();

            $newStatus = $reschedule ? OrderStatus::PROCESSING->value : OrderStatus::FAILED->value;

            $order->update([
                'status' => $newStatus,
                'fulfillment_status' => $reschedule ? 'pending_reschedule' : 'delivery_failed',
                'metadata' => array_merge($order->metadata ?? [], [
                    'delivery_attempts' => $attemptNumber,
                    'last_delivery_failure' => [
                        'reason' => $reason,
                        'attempted_at' => now()->toDateTimeString(),
                        'delivery_person_id' => $order->delivery_person_id,
                    ],
                ]),
            ]);

            $this->logStatusChange(
                $order,
                $newStatus,
                "Delivery attempt #{$attemptNumber} failed: {$reason}. " . ($reschedule ? 'Rescheduling delivery.' : 'Order marked as failed.')
            );

            ActivityLogService::log(
                'delivery_failed',
                'cod_order',
                $order,
                [
                    'previous_status' => OrderStatus::OUT_FOR_DELIVERY->value,
                    'new_status' => $newStatus,
                    'reason' => $reason,
                    'attempt_number' => $attemptNumber,
                    'reschedule' => $reschedule,
                ]
            );

            DB::commit();

            // Dispatch event
            event(new CodDeliveryFailed($order, $reason, $attemptNumber));

            return [
                'success' => true,
                'message' => $reschedule ? 'Delivery failure recorded and order rescheduled.' : 'Delivery marked as failed.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to handle delivery failure: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Complete the order after COD verification period.
     *
     * @param Order $order
     * @param string|null $comment
     * @return array
     */
    public function completeOrder(Order $order, ?string $comment = null): array
    {
        if (!$order->isCod()) {
            return [
                'success' => false,
                'message' => 'This is not a COD order.',
            ];
        }

        if ($order->status !== OrderStatus::DELIVERED->value) {
            return [
                'success' => false,
                'message' => 'Order must be delivered before completion.',
            ];
        }

        if (!$order->isCodCollected()) {
            return [
                'success' => false,
                'message' => 'COD payment must be collected before completion.',
            ];
        }

        try {
            DB::beginTransaction();

            $order->update([
                'status' => OrderStatus::COMPLETED->value,
                'fulfillment_status' => 'completed',
                'completed_at' => now(),
            ]);

            $this->logStatusChange($order, OrderStatus::COMPLETED->value, $comment ?? 'Order completed after COD verification period');

            ActivityLogService::log(
                'completed',
                'cod_order',
                $order,
                [
                    'previous_status' => OrderStatus::DELIVERED->value,
                    'new_status' => OrderStatus::COMPLETED->value,
                    'comment' => $comment,
                ]
            );

            DB::commit();

            return [
                'success' => true,
                'message' => 'Order completed successfully.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to complete order: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Cancel the order.
     *
     * @param Order $order
     * @param string $reason
     * @param string|null $comment
     * @return array
     */
    public function cancelOrder(Order $order, string $reason, ?string $comment = null): array
    {
        // Cannot cancel completed or already cancelled orders
        if (in_array($order->status, [OrderStatus::COMPLETED->value, OrderStatus::CANCELLED->value, OrderStatus::REFUNDED->value])) {
            return [
                'success' => false,
                'message' => 'Cannot cancel order in current status.',
            ];
        }

        try {
            DB::beginTransaction();

            $order->update([
                'status' => OrderStatus::CANCELLED->value,
                'fulfillment_status' => 'cancelled',
                'cancelled_at' => now(),
                'metadata' => array_merge($order->metadata ?? [], [
                    'cancellation_reason' => $reason,
                    'cancelled_by' => Auth::id(),
                    'cancelled_at' => now()->toDateTimeString(),
                ]),
            ]);

            $this->logStatusChange($order, OrderStatus::CANCELLED->value, $comment ?? "Order cancelled: {$reason}");

            ActivityLogService::log(
                'cancelled',
                'cod_order',
                $order,
                [
                    'previous_status' => $order->getOriginal('status'),
                    'new_status' => OrderStatus::CANCELLED->value,
                    'reason' => $reason,
                    'comment' => $comment,
                ]
            );

            DB::commit();

            return [
                'success' => true,
                'message' => 'Order cancelled successfully.',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Log status change to order_statuses table.
     *
     * @param Order $order
     * @param string $status
     * @param string|null $comment
     * @return void
     */
    protected function logStatusChange(Order $order, string $status, ?string $comment = null): void
    {
        OrderStatusModel::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'status' => $status,
            'comment' => $comment,
        ]);
    }

    /**
     * Get the current workflow state for an order.
     *
     * @param Order $order
     * @return array
     */
    public function getWorkflowState(Order $order): array
    {
        $currentStatus = OrderStatus::tryFrom($order->status);

        $availableActions = [];

        if (!$order->isCod()) {
            return [
                'current_status' => $order->status,
                'available_actions' => [],
                'workflow_enabled' => false,
            ];
        }

        // Determine available actions based on current status
        switch ($order->status) {
            case OrderStatus::PENDING->value:
                $availableActions = ['confirm', 'cancel'];
                break;
            case OrderStatus::CONFIRMED->value:
                $availableActions = ['start_processing', 'cancel'];
                break;
            case OrderStatus::PROCESSING->value:
                $availableActions = ['mark_out_for_delivery', 'cancel'];
                break;
            case OrderStatus::OUT_FOR_DELIVERY->value:
                $availableActions = ['confirm_delivery', 'mark_failed', 'cancel'];
                break;
            case OrderStatus::DELIVERED->value:
                $availableActions = ['complete', 'refund'];
                break;
            case OrderStatus::COMPLETED->value:
                $availableActions = ['refund'];
                break;
            case OrderStatus::FAILED->value:
                $availableActions = ['retry_delivery', 'cancel'];
                break;
            default:
                $availableActions = [];
        }

        return [
            'current_status' => $order->status,
            'current_status_label' => $currentStatus?->label() ?? $order->status,
            'available_actions' => $availableActions,
            'workflow_enabled' => true,
            'cod_collected' => $order->isCodCollected(),
            'delivery_person_assigned' => $order->delivery_person_id !== null,
        ];
    }
}
