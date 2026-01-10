<?php

namespace App\Services\Carriers;

use App\Models\OrderShipment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FedexCarrier implements ShippingCarrierInterface
{
    protected string $apiKey;
    protected string $apiSecret;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.fedex.api_key', '');
        $this->apiSecret = config('services.fedex.api_secret', '');
        $this->apiUrl = config('services.fedex.api_url', 'https://apis.fedex.com/track/v1/trackingnumbers');
    }

    /**
     * Get tracking information from FedEx.
     *
     * @param string $trackingNumber
     * @return array
     */
    public function getTrackingInfo(string $trackingNumber): array
    {
        if (empty($this->apiKey)) {
            Log::warning('FedEx API key not configured');
            return $this->getMockTrackingData($trackingNumber);
        }

        try {
            // First, get OAuth token
            $token = $this->getAuthToken();

            if (!$token) {
                return $this->getMockTrackingData($trackingNumber);
            }

            $response = Http::withToken($token)
                ->post($this->apiUrl, [
                    'trackingInfo' => [
                        [
                            'trackingNumberInfo' => [
                                'trackingNumber' => $trackingNumber,
                            ],
                        ],
                    ],
                    'includeDetailedScans' => true,
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('FedEx API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return $this->getMockTrackingData($trackingNumber);
        } catch (\Exception $e) {
            Log::error('FedEx API exception', [
                'message' => $e->getMessage(),
                'tracking_number' => $trackingNumber,
            ]);

            return $this->getMockTrackingData($trackingNumber);
        }
    }

    /**
     * Parse tracking events from FedEx response.
     *
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(array $response): array
    {
        $events = [];

        // FedEx API structure: output.completeTrackResults[0].trackResults[0].scanEvents[]
        $trackResults = $response['output']['completeTrackResults'][0]['trackResults'] ?? [];

        if (empty($trackResults)) {
            return $events;
        }

        $scanEvents = $trackResults[0]['scanEvents'] ?? [];

        foreach ($scanEvents as $event) {
            $events[] = [
                'status' => $this->mapFedexStatus($event['eventType'] ?? ''),
                'description' => $event['eventDescription'] ?? '',
                'location' => $this->formatLocation($event),
                'timestamp' => $event['date'] ?? now()->toIso8601String(),
            ];
        }

        return $events;
    }

    /**
     * Get the FedEx tracking URL.
     *
     * @param string $trackingNumber
     * @return string
     */
    public function getTrackingUrl(string $trackingNumber): string
    {
        return "https://www.fedex.com/fedextrack/?trknbr={$trackingNumber}";
    }

    /**
     * Create a shipping label with FedEx.
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function createLabel(OrderShipment $shipment): string
    {
        // In a real implementation, this would call FedEx's shipping API to create a label
        Log::info('FedEx label creation requested', ['shipment_id' => $shipment->id]);

        return route('shipments.label', ['shipment' => $shipment->id]);
    }

    /**
     * Validate FedEx tracking number format.
     *
     * @param string $trackingNumber
     * @return bool
     */
    public function validateTrackingNumber(string $trackingNumber): bool
    {
        // FedEx tracking numbers can be 12, 15, or 20 digits
        return preg_match('/^\d{12}$|^\d{15}$|^\d{20}$/', $trackingNumber) === 1;
    }

    /**
     * Get the carrier name.
     *
     * @return string
     */
    public function getCarrierName(): string
    {
        return 'FedEx';
    }

    /**
     * Get OAuth token from FedEx.
     *
     * @return string|null
     */
    protected function getAuthToken(): ?string
    {
        try {
            $response = Http::asForm()->post(
                config('services.fedex.oauth_url', 'https://apis.fedex.com/oauth/token'),
                [
                    'grant_type' => 'client_credentials',
                    'client_id' => $this->apiKey,
                    'client_secret' => $this->apiSecret,
                ]
            );

            if ($response->successful()) {
                return $response->json()['access_token'] ?? null;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('FedEx OAuth failed', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Map FedEx event types to internal status.
     *
     * @param string $eventType
     * @return string
     */
    protected function mapFedexStatus(string $eventType): string
    {
        $statusMap = [
            'PU' => 'picked_up',
            'OC' => 'in_transit',
            'IT' => 'in_transit',
            'AR' => 'in_transit',
            'OD' => 'out_for_delivery',
            'DL' => 'delivered',
            'DE' => 'exception',
        ];

        return $statusMap[$eventType] ?? 'in_transit';
    }

    /**
     * Format location from FedEx event data.
     *
     * @param array $event
     * @return string|null
     */
    protected function formatLocation(array $event): ?string
    {
        $scanLocation = $event['scanLocation'] ?? [];

        if (empty($scanLocation)) {
            return null;
        }

        $parts = array_filter([
            $scanLocation['city'] ?? null,
            $scanLocation['stateOrProvinceCode'] ?? null,
            $scanLocation['countryCode'] ?? null,
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
            'output' => [
                'completeTrackResults' => [
                    [
                        'trackResults' => [
                            [
                                'trackingNumberInfo' => [
                                    'trackingNumber' => $trackingNumber,
                                ],
                                'scanEvents' => [
                                    [
                                        'date' => now()->subDays(3)->toIso8601String(),
                                        'eventType' => 'OC',
                                        'eventDescription' => 'Shipment information sent to FedEx',
                                        'scanLocation' => [
                                            'city' => 'Memphis',
                                            'stateOrProvinceCode' => 'TN',
                                            'countryCode' => 'US',
                                        ],
                                    ],
                                    [
                                        'date' => now()->subDays(2)->toIso8601String(),
                                        'eventType' => 'PU',
                                        'eventDescription' => 'Picked up',
                                        'scanLocation' => [
                                            'city' => 'Memphis',
                                            'stateOrProvinceCode' => 'TN',
                                            'countryCode' => 'US',
                                        ],
                                    ],
                                    [
                                        'date' => now()->subDays(1)->toIso8601String(),
                                        'eventType' => 'IT',
                                        'eventDescription' => 'In transit',
                                        'scanLocation' => [
                                            'city' => 'Dallas',
                                            'stateOrProvinceCode' => 'TX',
                                            'countryCode' => 'US',
                                        ],
                                    ],
                                    [
                                        'date' => now()->toIso8601String(),
                                        'eventType' => 'AR',
                                        'eventDescription' => 'Arrived at FedEx location',
                                        'scanLocation' => [
                                            'city' => 'Phoenix',
                                            'stateOrProvinceCode' => 'AZ',
                                            'countryCode' => 'US',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
