<?php

namespace App\Services\Carriers;

use App\Models\OrderShipment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UspsCarrier implements ShippingCarrierInterface
{
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.usps.api_key', '');
        $this->apiUrl = config('services.usps.api_url', 'https://secure.shippingapis.com/ShippingAPI.dll');
    }

    /**
     * Get tracking information from USPS.
     *
     * @param string $trackingNumber
     * @return array
     */
    public function getTrackingInfo(string $trackingNumber): array
    {
        if (empty($this->apiKey)) {
            Log::warning('USPS API key not configured');
            return $this->getMockTrackingData($trackingNumber);
        }

        try {
            // USPS uses XML API
            $xml = '<?xml version="1.0" encoding="UTF-8"?>
                <TrackFieldRequest USERID="' . $this->apiKey . '">
                    <Revision>1</Revision>
                    <ClientIp>127.0.0.1</ClientIp>
                    <SourceId>Ecommerce</SourceId>
                    <TrackID ID="' . $trackingNumber . '"></TrackID>
                </TrackFieldRequest>';

            $response = Http::get($this->apiUrl, [
                'API' => 'TrackV2',
                'XML' => $xml,
            ]);

            if ($response->successful()) {
                $xmlData = simplexml_load_string($response->body());
                return $this->xmlToArray($xmlData);
            }

            Log::error('USPS API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return $this->getMockTrackingData($trackingNumber);
        } catch (\Exception $e) {
            Log::error('USPS API exception', [
                'message' => $e->getMessage(),
                'tracking_number' => $trackingNumber,
            ]);

            return $this->getMockTrackingData($trackingNumber);
        }
    }

    /**
     * Parse tracking events from USPS response.
     *
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(array $response): array
    {
        $events = [];

        // USPS API structure varies, but typically has TrackInfo.TrackDetail
        $trackInfo = $response['TrackInfo'] ?? $response;
        $trackDetails = [];

        // Handle both single and multiple track details
        if (isset($trackInfo['TrackDetail'])) {
            $trackDetails = is_array($trackInfo['TrackDetail']) && !isset($trackInfo['TrackDetail']['EventTime'])
                ? $trackInfo['TrackDetail']
                : [$trackInfo['TrackDetail']];
        }

        foreach ($trackDetails as $detail) {
            $events[] = [
                'status' => $this->mapUspsStatus($detail['Event'] ?? ''),
                'description' => $detail['Event'] ?? '',
                'location' => $this->formatLocation($detail),
                'timestamp' => $this->formatTimestamp($detail),
            ];
        }

        return $events;
    }

    /**
     * Get the USPS tracking URL.
     *
     * @param string $trackingNumber
     * @return string
     */
    public function getTrackingUrl(string $trackingNumber): string
    {
        return "https://tools.usps.com/go/TrackConfirmAction?tLabels={$trackingNumber}";
    }

    /**
     * Create a shipping label with USPS.
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function createLabel(OrderShipment $shipment): string
    {
        // In a real implementation, this would call USPS's shipping API to create a label
        Log::info('USPS label creation requested', ['shipment_id' => $shipment->id]);

        return route('shipments.label', ['shipment' => $shipment->id]);
    }

    /**
     * Validate USPS tracking number format.
     *
     * @param string $trackingNumber
     * @return bool
     */
    public function validateTrackingNumber(string $trackingNumber): bool
    {
        // USPS tracking numbers can be various formats:
        // - 20 digits
        // - 22 digits
        // - 26 characters starting with 9 (Express Mail)
        // - 13 characters (Certified Mail)
        return preg_match('/^\d{20}$|^\d{22}$|^9\d{25}$|^[A-Z]{2}\d{9}US$/', $trackingNumber) === 1;
    }

    /**
     * Get the carrier name.
     *
     * @return string
     */
    public function getCarrierName(): string
    {
        return 'USPS';
    }

    /**
     * Map USPS event descriptions to internal status.
     *
     * @param string $event
     * @return string
     */
    protected function mapUspsStatus(string $event): string
    {
        $event = strtolower($event);

        if (str_contains($event, 'delivered')) {
            return 'delivered';
        } elseif (str_contains($event, 'out for delivery')) {
            return 'out_for_delivery';
        } elseif (str_contains($event, 'picked up') || str_contains($event, 'acceptance')) {
            return 'picked_up';
        } elseif (str_contains($event, 'in transit') || str_contains($event, 'arrived') || str_contains($event, 'departed')) {
            return 'in_transit';
        } elseif (str_contains($event, 'label created') || str_contains($event, 'shipping label')) {
            return 'label_created';
        } elseif (str_contains($event, 'exception') || str_contains($event, 'notice left')) {
            return 'exception';
        }

        return 'in_transit';
    }

    /**
     * Format location from USPS detail data.
     *
     * @param array $detail
     * @return string|null
     */
    protected function formatLocation(array $detail): ?string
    {
        $parts = array_filter([
            $detail['EventCity'] ?? null,
            $detail['EventState'] ?? null,
            $detail['EventCountry'] ?? null,
        ]);

        return !empty($parts) ? implode(', ', $parts) : null;
    }

    /**
     * Format timestamp from USPS detail data.
     *
     * @param array $detail
     * @return string
     */
    protected function formatTimestamp(array $detail): string
    {
        $date = $detail['EventDate'] ?? null;
        $time = $detail['EventTime'] ?? null;

        if (!$date) {
            return now()->toIso8601String();
        }

        try {
            $timestamp = \Carbon\Carbon::parse("{$date} {$time}");
            return $timestamp->toIso8601String();
        } catch (\Exception $e) {
            return now()->toIso8601String();
        }
    }

    /**
     * Convert XML to array.
     *
     * @param \SimpleXMLElement $xml
     * @return array
     */
    protected function xmlToArray(\SimpleXMLElement $xml): array
    {
        $json = json_encode($xml);
        return json_decode($json, true);
    }

    /**
     * Get mock tracking data for testing.
     *
     * @param string $trackingNumber
     * @return array
     */
    protected function getMockTrackingData(string $trackingNumber): array
    {
        return [
            'TrackInfo' => [
                'ID' => $trackingNumber,
                'TrackDetail' => [
                    [
                        'EventTime' => now()->subDays(3)->format('g:i a'),
                        'EventDate' => now()->subDays(3)->format('F d, Y'),
                        'Event' => 'Shipping Label Created',
                        'EventCity' => 'New York',
                        'EventState' => 'NY',
                        'EventCountry' => 'US',
                    ],
                    [
                        'EventTime' => now()->subDays(2)->format('g:i a'),
                        'EventDate' => now()->subDays(2)->format('F d, Y'),
                        'Event' => 'Picked Up by Shipping Partner',
                        'EventCity' => 'New York',
                        'EventState' => 'NY',
                        'EventCountry' => 'US',
                    ],
                    [
                        'EventTime' => now()->subDay()->format('g:i a'),
                        'EventDate' => now()->subDay()->format('F d, Y'),
                        'Event' => 'In Transit to Next Facility',
                        'EventCity' => 'Philadelphia',
                        'EventState' => 'PA',
                        'EventCountry' => 'US',
                    ],
                    [
                        'EventTime' => now()->format('g:i a'),
                        'EventDate' => now()->format('F d, Y'),
                        'Event' => 'Arrived at Post Office',
                        'EventCity' => 'Boston',
                        'EventState' => 'MA',
                        'EventCountry' => 'US',
                    ],
                ],
            ],
        ];
    }
}
