<?php

namespace App\Http\Controllers;

use App\Models\OrderShipment;
use App\Services\ShipmentTrackingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    protected ShipmentTrackingService $trackingService;

    public function __construct(ShipmentTrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Show the public tracking page.
     *
     * @param string $trackingNumber
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function track(string $trackingNumber)
    {
        $shipment = OrderShipment::where('tracking_number', $trackingNumber)
            ->with(['order', 'vendor'])
            ->first();

        if (!$shipment) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tracking number not found',
                ], 404);
            }

            return Inertia::render('Tracking/Index', [
                'trackingNumber' => $trackingNumber,
                'shipment' => null,
                'error' => 'Tracking number not found',
            ]);
        }

        // Try to update tracking from carrier if it's been more than 1 hour since last update
        if ($shipment->shipping_carrier && $shipment->shipping_carrier !== 'local') {
            $shouldUpdate = !$shipment->last_tracking_update ||
                $shipment->last_tracking_update->lt(now()->subHour());

            if ($shouldUpdate && $shipment->status !== 'delivered') {
                try {
                    $this->trackingService->updateTrackingFromCarrier($shipment);
                    $shipment->refresh();
                } catch (\Exception $e) {
                    // Silently fail if tracking update fails
                    \Log::warning('Failed to update tracking', [
                        'tracking_number' => $trackingNumber,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        $trackingUrl = $this->trackingService->getTrackingUrl($shipment);

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'shipment' => $this->formatShipmentForApi($shipment),
                    'tracking_url' => $trackingUrl,
                ],
            ]);
        }

        return Inertia::render('Tracking/Index', [
            'trackingNumber' => $trackingNumber,
            'shipment' => $this->formatShipmentForFrontend($shipment),
            'trackingUrl' => $trackingUrl,
            'error' => null,
        ]);
    }

    /**
     * Get tracking updates via API (for polling).
     *
     * @param OrderShipment $shipment
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUpdates(OrderShipment $shipment)
    {
        // Update tracking from carrier if possible
        if ($shipment->shipping_carrier && $shipment->shipping_carrier !== 'local' && $shipment->status !== 'delivered') {
            try {
                $this->trackingService->updateTrackingFromCarrier($shipment);
                $shipment->refresh();
            } catch (\Exception $e) {
                // Continue even if update fails
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'shipment' => $this->formatShipmentForApi($shipment),
                'last_update' => $shipment->last_tracking_update?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Search for a shipment by tracking number (form submission).
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function search(Request $request)
    {
        $request->validate([
            'tracking_number' => 'required|string',
        ]);

        $trackingNumber = trim($request->input('tracking_number'));

        return redirect()->route('tracking.show', ['tracking_number' => $trackingNumber]);
    }

    /**
     * Download shipping label PDF.
     *
     * @param OrderShipment $shipment
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function label(OrderShipment $shipment)
    {
        // Check if user has permission to view this label
        // Either the shipment vendor, or the customer who owns the order
        $user = auth()->user();

        if (!$user) {
            abort(403, 'You must be logged in to view shipping labels');
        }

        $canView = $user->vendor_id === $shipment->vendor_id ||
            $shipment->order->user_id === $user->id;

        if (!$canView && !$user->hasRole('admin')) {
            abort(403, 'You do not have permission to view this shipping label');
        }

        if (!$shipment->label_url) {
            abort(404, 'Shipping label not found');
        }

        // If label_url is a full URL, redirect to it
        if (filter_var($shipment->label_url, FILTER_VALIDATE_URL)) {
            return redirect($shipment->label_url);
        }

        // Otherwise, serve from storage
        $labelPath = str_replace('/storage/', '', $shipment->label_url);

        if (!\Storage::disk('public')->exists($labelPath)) {
            abort(404, 'Shipping label file not found');
        }

        return response()->file(
            \Storage::disk('public')->path($labelPath),
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="shipping-label-' . $shipment->tracking_number . '.pdf"',
            ]
        );
    }

    /**
     * Format shipment data for API response.
     *
     * @param OrderShipment $shipment
     * @return array
     */
    protected function formatShipmentForApi(OrderShipment $shipment): array
    {
        return [
            'id' => $shipment->id,
            'tracking_number' => $shipment->tracking_number,
            'shipping_carrier' => $shipment->shipping_carrier,
            'shipping_method' => $shipment->shipping_method,
            'status' => $shipment->status,
            'shipped_at' => $shipment->shipped_at?->toIso8601String(),
            'estimated_delivery' => $shipment->estimated_delivery_at?->toIso8601String(),
            'delivered_at' => $shipment->delivered_at?->toIso8601String(),
            'last_tracking_update' => $shipment->last_tracking_update?->toIso8601String(),
            'tracking_events' => $shipment->tracking_events ?? [],
            'vendor' => [
                'id' => $shipment->vendor->id,
                'business_name' => $shipment->vendor->business_name,
            ],
        ];
    }

    /**
     * Format shipment data for frontend (Inertia).
     *
     * @param OrderShipment $shipment
     * @return array
     */
    protected function formatShipmentForFrontend(OrderShipment $shipment): array
    {
        return [
            'id' => $shipment->id,
            'tracking_number' => $shipment->tracking_number,
            'carrier' => $shipment->shipping_carrier,
            'carrier_name' => ucfirst($shipment->shipping_carrier ?? 'Unknown'),
            'method' => $shipment->shipping_method,
            'status' => $shipment->status,
            'status_label' => $this->getStatusLabel($shipment->status),
            'shipped_at' => $shipment->shipped_at?->format('M d, Y g:i A'),
            'shipped_at_iso' => $shipment->shipped_at?->toIso8601String(),
            'delivered_at' => $shipment->delivered_at?->format('M d, Y g:i A'),
            'delivered_at_iso' => $shipment->delivered_at?->toIso8601String(),
            'last_update' => $shipment->last_tracking_update?->format('M d, Y g:i A'),
            'last_update_iso' => $shipment->last_tracking_update?->toIso8601String(),
            'events' => $this->formatTrackingEvents($shipment->tracking_events ?? []),
            'vendor' => [
                'id' => $shipment->vendor->id,
                'name' => $shipment->vendor->business_name,
            ],
            'order' => [
                'id' => $shipment->order->id,
                'order_number' => $shipment->order->order_number,
            ],
        ];
    }

    /**
     * Format tracking events for frontend display.
     *
     * @param array $events
     * @return array
     */
    protected function formatTrackingEvents(array $events): array
    {
        return array_map(function ($event) {
            return [
                'status' => $event['status'] ?? '',
                'description' => $event['description'] ?? '',
                'location' => $event['location'] ?? null,
                'timestamp' => $event['timestamp'] ?? '',
                'timestamp_formatted' => isset($event['timestamp'])
                    ? \Carbon\Carbon::parse($event['timestamp'])->format('M d, Y g:i A')
                    : '',
                'is_manual' => $event['manual'] ?? false,
            ];
        }, $events);
    }

    /**
     * Get human-readable status label.
     *
     * @param string $status
     * @return string
     */
    protected function getStatusLabel(string $status): string
    {
        $labels = [
            'pending' => 'Pending Pickup',
            'in_transit' => 'In Transit',
            'out_for_delivery' => 'Out for Delivery',
            'delivered' => 'Delivered',
            'exception' => 'Delivery Exception',
            'returned' => 'Returned to Sender',
        ];

        return $labels[$status] ?? ucfirst(str_replace('_', ' ', $status));
    }
}
