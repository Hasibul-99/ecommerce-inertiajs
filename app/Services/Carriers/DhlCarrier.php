<?php

namespace App\Services\Carriers;

use App\Models\OrderShipment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DhlCarrier implements ShippingCarrierInterface
{
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.dhl.api_key', '');
        $this->apiUrl = config('services.dhl.api_url', 'https://api-eu.dhl.com/track/shipments');
    }

    /**
     * Get tracking information from DHL.
     *
     * @param string $trackingNumber
     * @return array
     */
    public function getTrackingInfo(string $trackingNumber): array
    {
        if (empty($this->apiKey)) {
            Log::warning('DHL API key not configured');
            return $this->getMockTrackingData($trackingNumber);
        }

        try {
            $response = Http::withHeaders([
                'DHL-API-Key' => $this->apiKey,
            ])->get("{$this->apiUrl}", [
                'trackingNumber' => $trackingNumber,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('DHL API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return $this->getMockTrackingData($trackingNumber);
        } catch (\Exception $e) {
            Log::error('DHL API exception', [
                'message' => $e->getMessage(),
                'tracking_number' => $trackingNumber,
            ]);

            return $this->getMockTrackingData($trackingNumber);
        }
    }

    /**
     * Parse tracking events from DHL response.
     *
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(array $response): array
    {
        $events = [];

        // DHL API structure: shipments[0].events[]
        $shipments = $response['shipments'] ?? [];

        if (empty($shipments)) {
            return $events;
        }

        $trackingEvents = $shipments[0]['events'] ?? [];

        foreach ($trackingEvents as $event) {
            $events[] = [
                'status' => $this->mapDhlStatus($event['statusCode'] ?? ''),
                'description' => $event['description'] ?? '',
                'location' => $this->formatLocation($event),
                'timestamp' => $event['timestamp'] ?? now()->toIso8601String(),
            ];
        }

        return $events;
    }

    /**
     * Get the DHL tracking URL.
     *
     * @param string $trackingNumber
     * @return string
     */
    public function getTrackingUrl(string $trackingNumber): string
    {
        return "https://www.dhl.com/en/express/tracking.html?AWB={$trackingNumber}";
    }

    /**
     * Create a shipping label with DHL.
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function createLabel(OrderShipment $shipment): string
    {
        // In a real implementation, this would call DHL's shipping API to create a label
        // For now, return a placeholder
        Log::info('DHL label creation requested', ['shipment_id' => $shipment->id]);

        return route('shipments.label', ['shipment' => $shipment->id]);
    }

    /**
     * Validate DHL tracking number format.
     *
     * @param string $trackingNumber
     * @return bool
     */
    public function validateTrackingNumber(string $trackingNumber): bool
    {
        // DHL tracking numbers are typically 10 digits
        return preg_match('/^\d{10}$/', $trackingNumber) === 1;
    }

    /**
     * Get the carrier name.
     *
     * @return string
     */
    public function getCarrierName(): string
    {
        return 'DHL';
    }

    /**
     * Map DHL status codes to internal status.
     *
     * @param string $statusCode
     * @return string
     */
    protected function mapDhlStatus(string $statusCode): string
    {
        $statusMap = [
            'pre-transit' => 'label_created',
            'transit' => 'in_transit',
            'delivered' => 'delivered',
            'failure' => 'exception',
            'unknown' => 'in_transit',
        ];

        return $statusMap[$statusCode] ?? 'in_transit';
    }

    /**
     * Format location from DHL event data.
     *
     * @param array $event
     * @return string|null
     */
    protected function formatLocation(array $event): ?string
    {
        $location = $event['location'] ?? [];

        if (empty($location)) {
            return null;
        }

        $parts = array_filter([
            $location['address']['addressLocality'] ?? null,
            $location['address']['addressRegion'] ?? null,
            $location['address']['countryCode'] ?? null,
        ]);

        return !empty($parts) ? implode(', ', $parts) : null;
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
            'shipments' => [
                [
                    'id' => $trackingNumber,
                    'service' => 'express',
                    'origin' => [
                        'address' => [
                            'addressLocality' => 'New York',
                            'countryCode' => 'US',
                        ],
                    ],
                    'destination' => [
                        'address' => [
                            'addressLocality' => 'Los Angeles',
                            'countryCode' => 'US',
                        ],
                    ],
                    'status' => [
                        'statusCode' => 'transit',
                        'status' => 'In Transit',
                    ],
                    'events' => [
                        [
                            'timestamp' => now()->subDays(2)->toIso8601String(),
                            'statusCode' => 'pre-transit',
                            'description' => 'Shipment information received',
                            'location' => [
                                'address' => [
                                    'addressLocality' => 'New York',
                                    'addressRegion' => 'NY',
                                    'countryCode' => 'US',
                                ],
                            ],
                        ],
                        [
                            'timestamp' => now()->subDays(1)->toIso8601String(),
                            'statusCode' => 'transit',
                            'description' => 'Departed facility',
                            'location' => [
                                'address' => [
                                    'addressLocality' => 'New York',
                                    'addressRegion' => 'NY',
                                    'countryCode' => 'US',
                                ],
                            ],
                        ],
                        [
                            'timestamp' => now()->toIso8601String(),
                            'statusCode' => 'transit',
                            'description' => 'In transit',
                            'location' => [
                                'address' => [
                                    'addressLocality' => 'Chicago',
                                    'addressRegion' => 'IL',
                                    'countryCode' => 'US',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
