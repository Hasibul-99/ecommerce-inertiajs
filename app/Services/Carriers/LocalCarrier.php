<?php

namespace App\Services\Carriers;

use App\Models\OrderShipment;
use Illuminate\Support\Facades\Log;

class LocalCarrier implements ShippingCarrierInterface
{
    /**
     * Get tracking information for local carrier.
     * For local carriers, we return the shipment's own tracking events.
     *
     * @param string $trackingNumber
     * @return array
     */
    public function getTrackingInfo(string $trackingNumber): array
    {
        // For local carriers, we manage tracking internally
        // Return a simple structure that will be parsed by parseTrackingEvents
        $shipment = OrderShipment::where('tracking_number', $trackingNumber)->first();

        if (!$shipment) {
            return ['events' => []];
        }

        return [
            'events' => $shipment->tracking_events ?? [],
        ];
    }

    /**
     * Parse tracking events from local carrier response.
     * For local carriers, events are already in our format.
     *
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(array $response): array
    {
        return $response['events'] ?? [];
    }

    /**
     * Get the tracking URL for local carrier.
     *
     * @param string $trackingNumber
     * @return string
     */
    public function getTrackingUrl(string $trackingNumber): string
    {
        return route('tracking.show', ['tracking_number' => $trackingNumber]);
    }

    /**
     * Create a shipping label for local carrier.
     * For local carriers, we generate a simple label internally.
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function createLabel(OrderShipment $shipment): string
    {
        // Generate a simple label URL for local carriers
        // In a real implementation, you might generate a PDF label
        Log::info('Local carrier label creation requested', ['shipment_id' => $shipment->id]);

        return route('shipments.label', ['shipment' => $shipment->id]);
    }

    /**
     * Validate local carrier tracking number format.
     * For local carriers, we accept any alphanumeric format.
     *
     * @param string $trackingNumber
     * @return bool
     */
    public function validateTrackingNumber(string $trackingNumber): bool
    {
        // For local carriers, accept any alphanumeric tracking number between 6 and 20 characters
        return preg_match('/^[A-Z0-9]{6,20}$/i', $trackingNumber) === 1;
    }

    /**
     * Get the carrier name.
     *
     * @return string
     */
    public function getCarrierName(): string
    {
        return 'Local Courier';
    }

    /**
     * Generate a tracking number for local carrier.
     *
     * @return string
     */
    public static function generateTrackingNumber(): string
    {
        // Generate a unique tracking number for local carriers
        // Format: LOCAL-YYYYMMDD-XXXX where X is random
        $date = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));

        return "LOCAL-{$date}-{$random}";
    }

    /**
     * Helper method to add a manual tracking event.
     * Used by vendors to manually update tracking status.
     *
     * @param OrderShipment $shipment
     * @param string $status
     * @param string $description
     * @param string|null $location
     * @return void
     */
    public function addManualTrackingEvent(
        OrderShipment $shipment,
        string $status,
        string $description,
        ?string $location = null
    ): void {
        $shipment->addTrackingEvent([
            'status' => $status,
            'description' => $description,
            'location' => $location,
            'timestamp' => now()->toIso8601String(),
            'manual' => true,
        ]);

        $shipment->save();

        Log::info('Manual tracking event added', [
            'shipment_id' => $shipment->id,
            'status' => $status,
        ]);
    }
}
