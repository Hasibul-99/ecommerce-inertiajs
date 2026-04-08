<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\OrderShipment;
use App\Models\TrackingToken;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class TrackingService
{
    /**
     * Generate a secure tracking token for an order.
     */
    public function generateTrackingToken(Order $order): string
    {
        // Check if a valid token already exists
        $existingToken = TrackingToken::where('order_id', $order->id)
            ->valid()
            ->first();

        if ($existingToken) {
            return $existingToken->token;
        }

        // Generate a new secure token
        $token = Str::random(32) . '-' . Str::random(32);

        // Create tracking token record
        TrackingToken::create([
            'order_id' => $order->id,
            'token' => $token,
            'expires_at' => now()->addDays(30),
            'created_at' => now(),
        ]);

        // Cache the token
        Cache::put("tracking.token.{$token}", $order->id, now()->addDays(30));

        return $token;
    }

    /**
     * Get comprehensive tracking data for an order.
     */
    public function getTrackingData(Order $order): array
    {
        // Cache tracking data for 5 minutes
        return Cache::remember("order.tracking.{$order->id}", 300, function () use ($order) {
            $order->load([
                'items.product.vendor',
                'shipments' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                },
                'shipments.vendor',
                'statuses' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                },
                'shippingAddress',
            ]);

            // Get all shipments with tracking data
            $shipments = $order->shipments->map(function ($shipment) use ($order) {
                return $this->formatShipmentData($shipment, $order);
            });

            // Calculate overall order progress
            $progressPercentage = $this->calculateOrderProgress($order);

            // Get tracking events timeline
            $timeline = $this->buildTrackingTimeline($order);

            // Get estimated delivery date
            $estimatedDelivery = $this->getEstimatedDelivery($order);

            return [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'total_cents' => $order->total_cents,
                    'created_at' => $order->created_at->toIso8601String(),
                    'delivered_at' => $order->delivered_at?->toIso8601String(),
                ],
                'shipping_address' => $order->shippingAddress ? [
                    'name' => $order->shippingAddress->full_name ?? $order->shippingAddress->first_name . ' ' . $order->shippingAddress->last_name,
                    'address_line_1' => $order->shippingAddress->address_line_1,
                    'address_line_2' => $order->shippingAddress->address_line_2,
                    'city' => $order->shippingAddress->city,
                    'state' => $order->shippingAddress->state,
                    'postal_code' => $order->shippingAddress->postal_code,
                    'country' => $order->shippingAddress->country,
                ] : null,
                'shipments' => $shipments->toArray(),
                'timeline' => $timeline,
                'progress_percentage' => $progressPercentage,
                'estimated_delivery' => $estimatedDelivery,
                'tracking_url' => $this->getPublicTrackingUrl($order),
            ];
        });
    }

    /**
     * Format shipment data for frontend.
     */
    private function formatShipmentData(OrderShipment $shipment, Order $order): array
    {
        $items = $order->items->where('vendor_id', $shipment->vendor_id);

        return [
            'id' => $shipment->id,
            'tracking_number' => $shipment->tracking_number,
            'carrier' => $shipment->shipping_carrier,
            'carrier_tracking_url' => $this->getCarrierTrackingUrl(
                $shipment->shipping_carrier,
                $shipment->tracking_number
            ),
            'status' => $shipment->status,
            'shipped_at' => $shipment->shipped_at?->toIso8601String(),
            'delivered_at' => $shipment->delivered_at?->toIso8601String(),
            'estimated_delivery_at' => $this->estimateDelivery($shipment)?->toIso8601String(),
            'vendor' => [
                'id' => $shipment->vendor->id,
                'name' => $shipment->vendor->business_name ?? $shipment->vendor->name,
            ],
            'items' => $items->map(function ($item) {
                return [
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'image' => $item->product->images->first()?->url ?? null,
                ];
            })->values()->toArray(),
            'events' => $shipment->tracking_events ?? [],
            'progress_percentage' => $this->calculateShipmentProgress($shipment),
        ];
    }

    /**
     * Build complete tracking timeline from all sources.
     */
    private function buildTrackingTimeline(Order $order): array
    {
        $events = collect();

        // Add order status changes
        foreach ($order->statuses as $status) {
            $events->push([
                'id' => 'status-' . $status->id,
                'status' => $status->status,
                'message' => $this->getStatusMessage($status->status),
                'location' => 'Order Processing',
                'timestamp' => $status->created_at->toIso8601String(),
                'type' => 'order_status',
            ]);
        }

        // Add shipment tracking events
        foreach ($order->shipments as $shipment) {
            if ($shipment->tracking_events) {
                foreach ($shipment->tracking_events as $event) {
                    $events->push([
                        'id' => $event['id'] ?? Str::uuid(),
                        'status' => $event['status'] ?? $shipment->status,
                        'message' => $event['message'] ?? $event['description'] ?? '',
                        'location' => $event['location'] ?? 'In Transit',
                        'timestamp' => $event['timestamp'] ?? $event['recorded_at'] ?? now()->toIso8601String(),
                        'type' => 'shipment_tracking',
                        'carrier' => $shipment->shipping_carrier,
                    ]);
                }
            }
        }

        // Sort by timestamp (most recent first)
        return $events->sortByDesc('timestamp')->values()->toArray();
    }

    /**
     * Calculate order progress percentage.
     */
    private function calculateOrderProgress(Order $order): int
    {
        $statusProgress = [
            'pending' => 0,
            'confirmed' => 10,
            'processing' => 25,
            'ready_to_ship' => 40,
            'shipped' => 60,
            'in_transit' => 75,
            'out_for_delivery' => 90,
            'delivered' => 100,
            'cancelled' => 0,
            'refunded' => 0,
        ];

        return $statusProgress[$order->status] ?? 0;
    }

    /**
     * Calculate shipment progress percentage.
     */
    private function calculateShipmentProgress(OrderShipment $shipment): int
    {
        $statusProgress = [
            'pending' => 0,
            'label_created' => 20,
            'picked_up' => 40,
            'in_transit' => 60,
            'out_for_delivery' => 80,
            'delivered' => 100,
            'exception' => 50,
        ];

        return $statusProgress[$shipment->status] ?? 0;
    }

    /**
     * Estimate delivery date for a shipment.
     */
    public function estimateDelivery(OrderShipment $shipment): ?Carbon
    {
        if ($shipment->delivered_at) {
            return $shipment->delivered_at;
        }

        // Use shipped_at + carrier estimated days
        if ($shipment->shipped_at) {
            $daysToAdd = $this->getCarrierEstimatedDays($shipment->shipping_carrier, $shipment->shipping_method);
            return $shipment->shipped_at->addDays($daysToAdd);
        }

        return null;
    }

    /**
     * Get estimated delivery days for carrier.
     */
    private function getCarrierEstimatedDays(string $carrier, ?string $method = null): int
    {
        $estimates = [
            'fedex' => [
                'overnight' => 1,
                'express' => 2,
                'ground' => 5,
                'default' => 5,
            ],
            'ups' => [
                'next_day' => 1,
                '2day' => 2,
                'ground' => 5,
                'default' => 5,
            ],
            'usps' => [
                'priority' => 3,
                'first_class' => 3,
                'parcel' => 7,
                'default' => 5,
            ],
            'dhl' => [
                'express' => 2,
                'default' => 5,
            ],
        ];

        $carrier = strtolower($carrier);
        if (isset($estimates[$carrier])) {
            return $estimates[$carrier][$method ?? 'default'] ?? $estimates[$carrier]['default'];
        }

        return 7; // Default 7 days
    }

    /**
     * Get estimated delivery for overall order.
     */
    private function getEstimatedDelivery(Order $order): ?string
    {
        if ($order->delivered_at) {
            return $order->delivered_at->toIso8601String();
        }

        // Get the latest estimated delivery from all shipments
        $latestEstimate = null;
        foreach ($order->shipments as $shipment) {
            $estimate = $this->estimateDelivery($shipment);
            if ($estimate && (!$latestEstimate || $estimate->isAfter($latestEstimate))) {
                $latestEstimate = $estimate;
            }
        }

        return $latestEstimate?->toIso8601String();
    }

    /**
     * Get carrier-specific tracking URL.
     */
    public function getCarrierTrackingUrl(string $carrier, string $trackingNumber): string
    {
        $carrier = strtolower($carrier);

        $urls = [
            'fedex' => "https://www.fedex.com/fedextrack/?trknbr={$trackingNumber}",
            'ups' => "https://www.ups.com/track?tracknum={$trackingNumber}",
            'usps' => "https://tools.usps.com/go/TrackConfirmAction?tLabels={$trackingNumber}",
            'dhl' => "https://www.dhl.com/en/express/tracking.html?AWB={$trackingNumber}",
        ];

        return $urls[$carrier] ?? "#";
    }

    /**
     * Get public tracking URL for an order.
     */
    private function getPublicTrackingUrl(Order $order): string
    {
        $token = $this->generateTrackingToken($order);
        return route('track-order.show', ['token' => $token]);
    }

    /**
     * Get human-readable status message.
     */
    private function getStatusMessage(string $status): string
    {
        $messages = [
            'pending' => 'Order placed and awaiting confirmation',
            'confirmed' => 'Order confirmed and being prepared',
            'processing' => 'Order is being processed',
            'ready_to_ship' => 'Order is ready for shipment',
            'shipped' => 'Order has been shipped',
            'in_transit' => 'Order is in transit',
            'out_for_delivery' => 'Order is out for delivery',
            'delivered' => 'Order has been delivered',
            'cancelled' => 'Order has been cancelled',
            'refunded' => 'Order has been refunded',
        ];

        return $messages[$status] ?? ucfirst(str_replace('_', ' ', $status));
    }

    /**
     * Find order by tracking token.
     */
    public function findOrderByToken(string $token): ?Order
    {
        // Try to get from cache first
        $orderId = Cache::get("tracking.token.{$token}");

        if ($orderId) {
            return Order::find($orderId);
        }

        // Find in database
        $trackingToken = TrackingToken::where('token', $token)
            ->valid()
            ->first();

        if ($trackingToken) {
            // Update cache
            Cache::put("tracking.token.{$token}", $trackingToken->order_id, now()->addDays(30));
            return $trackingToken->order;
        }

        return null;
    }
}
