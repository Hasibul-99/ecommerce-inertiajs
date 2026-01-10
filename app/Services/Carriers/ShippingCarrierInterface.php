<?php

namespace App\Services\Carriers;

use App\Models\OrderShipment;

interface ShippingCarrierInterface
{
    /**
     * Get tracking information from the carrier.
     *
     * @param string $trackingNumber
     * @return array
     */
    public function getTrackingInfo(string $trackingNumber): array;

    /**
     * Parse tracking events from carrier response.
     *
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(array $response): array;

    /**
     * Get the tracking URL for the carrier.
     *
     * @param string $trackingNumber
     * @return string
     */
    public function getTrackingUrl(string $trackingNumber): string;

    /**
     * Create a shipping label.
     *
     * @param OrderShipment $shipment
     * @return string Label URL
     */
    public function createLabel(OrderShipment $shipment): string;

    /**
     * Validate a tracking number format.
     *
     * @param string $trackingNumber
     * @return bool
     */
    public function validateTrackingNumber(string $trackingNumber): bool;

    /**
     * Get the carrier name.
     *
     * @return string
     */
    public function getCarrierName(): string;
}
