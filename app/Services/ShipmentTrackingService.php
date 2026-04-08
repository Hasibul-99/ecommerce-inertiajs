<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderShipment;
use App\Events\ShipmentCreated;
use App\Events\ShipmentInTransit;
use App\Events\ShipmentOutForDelivery;
use App\Events\ShipmentDelivered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ShipmentTrackingService
{
    /**
     * Create a new shipment for an order.
     *
     * @param Order $order
     * @param array $data
     * @return OrderShipment
     * @throws \Exception
     */
    public function createShipment(Order $order, array $data): OrderShipment
    {
        return DB::transaction(function () use ($order, $data) {
            // Validate that the vendor owns this order
            $vendorId = $data['vendor_id'] ?? null;
            if (!$vendorId) {
                throw new \Exception('Vendor ID is required to create a shipment.');
            }

            // Check if a shipment already exists for this vendor
            $existingShipment = OrderShipment::where('order_id', $order->id)
                ->where('vendor_id', $vendorId)
                ->first();

            if ($existingShipment) {
                throw new \Exception('A shipment already exists for this vendor and order.');
            }

            // Create the shipment
            $shipment = OrderShipment::create([
                'order_id' => $order->id,
                'vendor_id' => $vendorId,
                'tracking_number' => $data['tracking_number'] ?? null,
                'label_url' => $data['label_url'] ?? null,
                'label_created_at' => $data['label_url'] ? now() : null,
                'shipping_carrier' => $data['shipping_carrier'] ?? null,
                'shipping_method' => $data['shipping_method'] ?? 'standard',
                'weight' => $data['weight'] ?? null,
                'dimensions' => $data['dimensions'] ?? null,
                'shipping_cost_cents' => $data['shipping_cost_cents'] ?? 0,
                'insurance_cents' => $data['insurance_cents'] ?? null,
                'status' => 'pending',
                'pickup_scheduled_at' => $data['pickup_scheduled_at'] ?? null,
            ]);

            // Add initial tracking event
            if ($shipment->tracking_number) {
                $shipment->addTrackingEvent([
                    'status' => 'label_created',
                    'description' => 'Shipping label created',
                    'location' => null,
                    'timestamp' => now()->toIso8601String(),
                ]);
                $shipment->save();
            }

            // Fire shipment created event
            event(new ShipmentCreated($shipment));

            // Log activity
            activity()
                ->performedOn($shipment)
                ->causedBy(auth()->user())
                ->withProperties([
                    'order_id' => $order->id,
                    'vendor_id' => $vendorId,
                    'tracking_number' => $shipment->tracking_number,
                ])
                ->log('shipment_created');

            return $shipment->load('order', 'vendor');
        });
    }

    /**
     * Update tracking information from the carrier.
     *
     * @param OrderShipment $shipment
     * @return void
     * @throws \Exception
     */
    public function updateTrackingFromCarrier(OrderShipment $shipment): void
    {
        if (!$shipment->tracking_number) {
            throw new \Exception('Shipment does not have a tracking number.');
        }

        if (!$shipment->shipping_carrier) {
            throw new \Exception('Shipment does not have a carrier specified.');
        }

        try {
            // Get the appropriate carrier service
            $carrierService = $this->getCarrierService($shipment->shipping_carrier);

            // Fetch tracking data from carrier
            $trackingData = $carrierService->getTrackingInfo($shipment->tracking_number);

            // Parse the tracking events
            $events = $this->parseTrackingEvents($shipment->shipping_carrier, $trackingData);

            // Update shipment with new tracking data
            DB::transaction(function () use ($shipment, $events, $trackingData) {
                $oldStatus = $shipment->status;

                // Update status based on latest event
                if (!empty($events)) {
                    $latestEvent = end($events);
                    $newStatus = $this->mapCarrierStatusToInternalStatus($latestEvent['status']);

                    if ($newStatus) {
                        $shipment->status = $newStatus;
                    }

                    // Update delivery timestamp if delivered
                    if ($newStatus === 'delivered' && !$shipment->delivered_at) {
                        $shipment->delivered_at = $latestEvent['timestamp'] ?? now();
                    }

                    // Update shipped timestamp if in transit and not yet set
                    if (in_array($newStatus, ['in_transit', 'out_for_delivery', 'delivered']) && !$shipment->shipped_at) {
                        $shipment->shipped_at = $events[0]['timestamp'] ?? now();
                    }

                    // Update picked up timestamp if available
                    if (!$shipment->picked_up_at && in_array($newStatus, ['in_transit', 'out_for_delivery', 'delivered'])) {
                        $shipment->picked_up_at = $events[0]['timestamp'] ?? now();
                    }
                }

                // Merge new events with existing ones (avoid duplicates)
                $existingEvents = $shipment->tracking_events ?? [];
                $mergedEvents = $this->mergeTrackingEvents($existingEvents, $events);

                $shipment->tracking_events = $mergedEvents;
                $shipment->last_tracking_update = now();
                $shipment->save();

                // Fire appropriate event based on status change
                if ($oldStatus !== $shipment->status) {
                    $this->fireStatusChangeEvent($shipment, $oldStatus);
                }

                // Log activity
                activity()
                    ->performedOn($shipment)
                    ->withProperties([
                        'old_status' => $oldStatus,
                        'new_status' => $shipment->status,
                        'events_count' => count($events),
                    ])
                    ->log('shipment_tracking_updated');
            });
        } catch (\Exception $e) {
            Log::error('Failed to update tracking for shipment ' . $shipment->id, [
                'error' => $e->getMessage(),
                'tracking_number' => $shipment->tracking_number,
                'carrier' => $shipment->shipping_carrier,
            ]);

            throw $e;
        }
    }

    /**
     * Parse tracking events from carrier response.
     *
     * @param string $carrier
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(string $carrier, array $response): array
    {
        $carrierService = $this->getCarrierService($carrier);
        return $carrierService->parseTrackingEvents($response);
    }

    /**
     * Get the tracking URL for a shipment.
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function getTrackingUrl(OrderShipment $shipment): string
    {
        if (!$shipment->tracking_number) {
            return '';
        }

        if (!$shipment->shipping_carrier) {
            return route('tracking.show', ['tracking_number' => $shipment->tracking_number]);
        }

        $carrierService = $this->getCarrierService($shipment->shipping_carrier);
        return $carrierService->getTrackingUrl($shipment->tracking_number);
    }

    /**
     * Get the appropriate carrier service.
     *
     * @param string $carrier
     * @return \App\Services\Carriers\ShippingCarrierInterface
     * @throws \Exception
     */
    protected function getCarrierService(string $carrier)
    {
        $carrierClass = $this->getCarrierClass($carrier);

        if (!class_exists($carrierClass)) {
            throw new \Exception("Carrier service class not found: {$carrierClass}");
        }

        return app($carrierClass);
    }

    /**
     * Get the carrier class name.
     *
     * @param string $carrier
     * @return string
     */
    protected function getCarrierClass(string $carrier): string
    {
        $carrierMap = [
            'dhl' => \App\Services\Carriers\DhlCarrier::class,
            'fedex' => \App\Services\Carriers\FedexCarrier::class,
            'ups' => \App\Services\Carriers\UpsCarrier::class,
            'usps' => \App\Services\Carriers\UspsCarrier::class,
            'local' => \App\Services\Carriers\LocalCarrier::class,
        ];

        $carrierLower = strtolower($carrier);

        return $carrierMap[$carrierLower] ?? \App\Services\Carriers\LocalCarrier::class;
    }

    /**
     * Map carrier-specific status to internal status.
     *
     * @param string $carrierStatus
     * @return string|null
     */
    protected function mapCarrierStatusToInternalStatus(string $carrierStatus): ?string
    {
        $statusMap = [
            'label_created' => 'pending',
            'picked_up' => 'in_transit',
            'in_transit' => 'in_transit',
            'out_for_delivery' => 'out_for_delivery',
            'delivered' => 'delivered',
            'exception' => 'exception',
            'failed_attempt' => 'exception',
            'returned' => 'returned',
        ];

        return $statusMap[$carrierStatus] ?? null;
    }

    /**
     * Merge new tracking events with existing ones, avoiding duplicates.
     *
     * @param array $existing
     * @param array $new
     * @return array
     */
    protected function mergeTrackingEvents(array $existing, array $new): array
    {
        $merged = $existing;

        foreach ($new as $newEvent) {
            // Check if event already exists (by timestamp and status)
            $exists = false;
            foreach ($existing as $existingEvent) {
                if (
                    ($existingEvent['timestamp'] ?? null) === ($newEvent['timestamp'] ?? null) &&
                    ($existingEvent['status'] ?? null) === ($newEvent['status'] ?? null)
                ) {
                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                $merged[] = $newEvent;
            }
        }

        // Sort by timestamp (oldest first)
        usort($merged, function ($a, $b) {
            $aTime = strtotime($a['timestamp'] ?? '');
            $bTime = strtotime($b['timestamp'] ?? '');
            return $aTime <=> $bTime;
        });

        return $merged;
    }

    /**
     * Fire the appropriate event based on status change.
     *
     * @param OrderShipment $shipment
     * @param string $oldStatus
     * @return void
     */
    protected function fireStatusChangeEvent(OrderShipment $shipment, string $oldStatus): void
    {
        switch ($shipment->status) {
            case 'in_transit':
                event(new ShipmentInTransit($shipment));
                break;
            case 'out_for_delivery':
                event(new ShipmentOutForDelivery($shipment));
                break;
            case 'delivered':
                event(new ShipmentDelivered($shipment));
                break;
        }
    }

    /**
     * Mark a shipment as shipped.
     *
     * @param OrderShipment $shipment
     * @return void
     */
    public function markAsShipped(OrderShipment $shipment): void
    {
        DB::transaction(function () use ($shipment) {
            $shipment->update([
                'status' => 'in_transit',
                'shipped_at' => now(),
            ]);

            $shipment->addTrackingEvent([
                'status' => 'picked_up',
                'description' => 'Package picked up by carrier',
                'location' => null,
                'timestamp' => now()->toIso8601String(),
            ]);
            $shipment->save();

            event(new ShipmentInTransit($shipment));

            activity()
                ->performedOn($shipment)
                ->causedBy(auth()->user())
                ->log('shipment_marked_shipped');
        });
    }

    /**
     * Generate a shipping label URL (placeholder for actual label generation).
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function generateLabel(OrderShipment $shipment): string
    {
        // In a real implementation, this would call the carrier's API to generate a label
        // For now, we'll create a placeholder

        if ($shipment->shipping_carrier && $shipment->shipping_carrier !== 'local') {
            $carrierService = $this->getCarrierService($shipment->shipping_carrier);
            return $carrierService->createLabel($shipment);
        }

        // For local carriers, generate a simple label URL
        $labelPath = "labels/shipment_{$shipment->id}_label.pdf";
        $shipment->update([
            'label_url' => Storage::url($labelPath),
            'label_created_at' => now(),
        ]);

        return $shipment->label_url;
    }
}
