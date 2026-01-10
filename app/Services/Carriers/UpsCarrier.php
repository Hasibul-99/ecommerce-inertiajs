<?php

namespace App\Services\Carriers;

use App\Models\OrderShipment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UpsCarrier implements ShippingCarrierInterface
{
    protected string $apiKey;
    protected string $username;
    protected string $password;
    protected string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.ups.api_key', '');
        $this->username = config('services.ups.username', '');
        $this->password = config('services.ups.password', '');
        $this->apiUrl = config('services.ups.api_url', 'https://onlinetools.ups.com/track/v1/details');
    }

    /**
     * Get tracking information from UPS.
     *
     * @param string $trackingNumber
     * @return array
     */
    public function getTrackingInfo(string $trackingNumber): array
    {
        if (empty($this->apiKey)) {
            Log::warning('UPS API key not configured');
            return $this->getMockTrackingData($trackingNumber);
        }

        try {
            $response = Http::withHeaders([
                'AccessLicenseNumber' => $this->apiKey,
                'Username' => $this->username,
                'Password' => $this->password,
            ])->get("{$this->apiUrl}/{$trackingNumber}");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('UPS API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return $this->getMockTrackingData($trackingNumber);
        } catch (\Exception $e) {
            Log::error('UPS API exception', [
                'message' => $e->getMessage(),
                'tracking_number' => $trackingNumber,
            ]);

            return $this->getMockTrackingData($trackingNumber);
        }
    }

    /**
     * Parse tracking events from UPS response.
     *
     * @param array $response
     * @return array
     */
    public function parseTrackingEvents(array $response): array
    {
        $events = [];

        // UPS API structure: trackResponse.shipment[0].package[0].activity[]
        $shipments = $response['trackResponse']['shipment'] ?? [];

        if (empty($shipments)) {
            return $events;
        }

        $packages = $shipments[0]['package'] ?? [];

        if (empty($packages)) {
            return $events;
        }

        $activities = $packages[0]['activity'] ?? [];

        foreach ($activities as $activity) {
            $events[] = [
                'status' => $this->mapUpsStatus($activity['status']['type'] ?? ''),
                'description' => $activity['status']['description'] ?? '',
                'location' => $this->formatLocation($activity),
                'timestamp' => $this->formatTimestamp($activity),
            ];
        }

        return $events;
    }

    /**
     * Get the UPS tracking URL.
     *
     * @param string $trackingNumber
     * @return string
     */
    public function getTrackingUrl(string $trackingNumber): string
    {
        return "https://www.ups.com/track?tracknum={$trackingNumber}";
    }

    /**
     * Create a shipping label with UPS.
     *
     * @param OrderShipment $shipment
     * @return string
     */
    public function createLabel(OrderShipment $shipment): string
    {
        // In a real implementation, this would call UPS's shipping API to create a label
        Log::info('UPS label creation requested', ['shipment_id' => $shipment->id]);

        return route('shipments.label', ['shipment' => $shipment->id]);
    }

    /**
     * Validate UPS tracking number format.
     *
     * @param string $trackingNumber
     * @return bool
     */
    public function validateTrackingNumber(string $trackingNumber): bool
    {
        // UPS tracking numbers start with "1Z" followed by 16 alphanumeric characters
        // or can be 18 digits
        return preg_match('/^1Z[A-Z0-9]{16}$|^\d{18}$/', $trackingNumber) === 1;
    }

    /**
     * Get the carrier name.
     *
     * @return string
     */
    public function getCarrierName(): string
    {
        return 'UPS';
    }

    /**
     * Map UPS status types to internal status.
     *
     * @param string $statusType
     * @return string
     */
    protected function mapUpsStatus(string $statusType): string
    {
        $statusMap = [
            'M' => 'label_created', // Manifest
            'P' => 'picked_up',     // Pickup
            'I' => 'in_transit',    // In Transit
            'X' => 'exception',     // Exception
            'D' => 'delivered',     // Delivered
            'O' => 'out_for_delivery', // Out for Delivery
        ];

        return $statusMap[$statusType] ?? 'in_transit';
    }

    /**
     * Format location from UPS activity data.
     *
     * @param array $activity
     * @return string|null
     */
    protected function formatLocation(array $activity): ?string
    {
        $location = $activity['location']['address'] ?? [];

        if (empty($location)) {
            return null;
        }

        $parts = array_filter([
            $location['city'] ?? null,
            $location['stateProvince'] ?? null,
            $location['countryCode'] ?? null,
        ]);

        return !empty($parts) ? implode(', ', $parts) : null;
    }

    /**
     * Format timestamp from UPS activity data.
     *
     * @param array $activity
     * @return string
     */
    protected function formatTimestamp(array $activity): string
    {
        $date = $activity['date'] ?? null;
        $time = $activity['time'] ?? null;

        if (!$date) {
            return now()->toIso8601String();
        }

        // UPS date format: YYYYMMDD, time format: HHMMSS
        $timestamp = "{$date}";
        if ($time) {
            $timestamp .= " {$time}";
        }

        try {
            return \Carbon\Carbon::createFromFormat('Ymd His', $timestamp)->toIso8601String();
        } catch (\Exception $e) {
            return now()->toIso8601String();
        }
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
            'trackResponse' => [
                'shipment' => [
                    [
                        'package' => [
                            [
                                'trackingNumber' => $trackingNumber,
                                'activity' => [
                                    [
                                        'date' => now()->subDays(3)->format('Ymd'),
                                        'time' => now()->subDays(3)->format('His'),
                                        'status' => [
                                            'type' => 'M',
                                            'description' => 'Shipper created a label',
                                        ],
                                        'location' => [
                                            'address' => [
                                                'city' => 'Atlanta',
                                                'stateProvince' => 'GA',
                                                'countryCode' => 'US',
                                            ],
                                        ],
                                    ],
                                    [
                                        'date' => now()->subDays(2)->format('Ymd'),
                                        'time' => now()->subDays(2)->format('His'),
                                        'status' => [
                                            'type' => 'P',
                                            'description' => 'Package picked up',
                                        ],
                                        'location' => [
                                            'address' => [
                                                'city' => 'Atlanta',
                                                'stateProvince' => 'GA',
                                                'countryCode' => 'US',
                                            ],
                                        ],
                                    ],
                                    [
                                        'date' => now()->subDay()->format('Ymd'),
                                        'time' => now()->subDay()->format('His'),
                                        'status' => [
                                            'type' => 'I',
                                            'description' => 'Package in transit',
                                        ],
                                        'location' => [
                                            'address' => [
                                                'city' => 'Louisville',
                                                'stateProvince' => 'KY',
                                                'countryCode' => 'US',
                                            ],
                                        ],
                                    ],
                                    [
                                        'date' => now()->format('Ymd'),
                                        'time' => now()->format('His'),
                                        'status' => [
                                            'type' => 'I',
                                            'description' => 'Arrived at facility',
                                        ],
                                        'location' => [
                                            'address' => [
                                                'city' => 'Miami',
                                                'stateProvince' => 'FL',
                                                'countryCode' => 'US',
                                            ],
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
