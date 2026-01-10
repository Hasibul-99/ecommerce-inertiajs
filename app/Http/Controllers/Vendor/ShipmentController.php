<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderShipment;
use App\Services\ShipmentTrackingService;
use App\Services\Carriers\LocalCarrier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    protected ShipmentTrackingService $trackingService;

    public function __construct(ShipmentTrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Display a listing of vendor's shipments.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $vendor = $request->user()->vendor;

        if (!$vendor) {
            abort(403, 'You must be a vendor to access this page');
        }

        $query = OrderShipment::where('vendor_id', $vendor->id)
            ->with(['order', 'order.user']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by tracking number or order number
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                    ->orWhereHas('order', function ($orderQuery) use ($search) {
                        $orderQuery->where('order_number', 'like', "%{$search}%");
                    });
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $shipments = $query->paginate(20)->through(function ($shipment) {
            return [
                'id' => $shipment->id,
                'tracking_number' => $shipment->tracking_number,
                'shipping_carrier' => $shipment->shipping_carrier,
                'shipping_method' => $shipment->shipping_method,
                'status' => $shipment->status,
                'shipped_at' => $shipment->shipped_at?->format('M d, Y'),
                'delivered_at' => $shipment->delivered_at?->format('M d, Y'),
                'created_at' => $shipment->created_at->format('M d, Y'),
                'order' => [
                    'id' => $shipment->order->id,
                    'order_number' => $shipment->order->order_number,
                    'customer_name' => $shipment->order->user->name ?? 'Guest',
                ],
                'has_label' => $shipment->hasLabel(),
            ];
        });

        return Inertia::render('Vendor/Shipments/Index', [
            'shipments' => $shipments,
            'filters' => $request->only(['status', 'search', 'sort', 'order']),
        ]);
    }

    /**
     * Show the form for creating a new shipment.
     *
     * @param Order $order
     * @return \Inertia\Response
     */
    public function create(Order $order)
    {
        $vendor = auth()->user()->vendor;

        if (!$vendor) {
            abort(403, 'You must be a vendor to create shipments');
        }

        // Check if vendor has items in this order
        $vendorItems = $order->items()->whereHas('product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })->with('product')->get();

        if ($vendorItems->isEmpty()) {
            abort(403, 'This order does not contain any of your products');
        }

        // Check if shipment already exists
        $existingShipment = OrderShipment::where('order_id', $order->id)
            ->where('vendor_id', $vendor->id)
            ->first();

        if ($existingShipment) {
            return redirect()->route('vendor.shipments.edit', $existingShipment)
                ->with('error', 'A shipment already exists for this order');
        }

        // Get shipping address
        $shippingAddress = $order->shippingAddress;

        return Inertia::render('Vendor/Shipments/Create', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name ?? 'Guest',
                'items' => $vendorItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'weight' => $item->product->weight,
                    ];
                }),
                'total_weight' => $vendorItems->sum(function ($item) {
                    return ($item->product->weight ?? 0) * $item->quantity;
                }),
            ],
            'shipping_address' => $shippingAddress ? [
                'address_line1' => $shippingAddress->address_line1,
                'address_line2' => $shippingAddress->address_line2,
                'city' => $shippingAddress->city,
                'state' => $shippingAddress->state,
                'postal_code' => $shippingAddress->postal_code,
                'country' => $shippingAddress->country,
            ] : null,
            'carriers' => $this->getAvailableCarriers(),
        ]);
    }

    /**
     * Store a newly created shipment.
     *
     * @param Request $request
     * @param Order $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Order $order)
    {
        $vendor = $request->user()->vendor;

        if (!$vendor) {
            abort(403, 'You must be a vendor to create shipments');
        }

        $request->validate([
            'shipping_carrier' => 'required|string',
            'shipping_method' => 'required|string',
            'tracking_number' => 'nullable|string',
            'weight' => 'nullable|integer|min:1',
            'dimensions' => 'nullable|array',
            'dimensions.length' => 'nullable|numeric|min:0',
            'dimensions.width' => 'nullable|numeric|min:0',
            'dimensions.height' => 'nullable|numeric|min:0',
            'shipping_cost_cents' => 'nullable|integer|min:0',
            'insurance_cents' => 'nullable|integer|min:0',
            'pickup_scheduled_at' => 'nullable|date',
        ]);

        try {
            // Generate tracking number if using local carrier and none provided
            if ($request->shipping_carrier === 'local' && !$request->tracking_number) {
                $trackingNumber = LocalCarrier::generateTrackingNumber();
            } else {
                $trackingNumber = $request->tracking_number;
            }

            $shipmentData = [
                'vendor_id' => $vendor->id,
                'tracking_number' => $trackingNumber,
                'shipping_carrier' => $request->shipping_carrier,
                'shipping_method' => $request->shipping_method,
                'weight' => $request->weight,
                'dimensions' => $request->dimensions,
                'shipping_cost_cents' => $request->shipping_cost_cents ?? 0,
                'insurance_cents' => $request->insurance_cents,
                'pickup_scheduled_at' => $request->pickup_scheduled_at,
            ];

            $shipment = $this->trackingService->createShipment($order, $shipmentData);

            activity()
                ->performedOn($shipment)
                ->causedBy($request->user())
                ->withProperties(['order_id' => $order->id])
                ->log('vendor_created_shipment');

            return redirect()->route('vendor.shipments.index')
                ->with('success', 'Shipment created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified shipment.
     *
     * @param OrderShipment $shipment
     * @return \Inertia\Response
     */
    public function show(OrderShipment $shipment)
    {
        $vendor = auth()->user()->vendor;

        if (!$vendor || $shipment->vendor_id !== $vendor->id) {
            abort(403, 'You do not have permission to view this shipment');
        }

        $shipment->load(['order', 'order.user', 'order.shippingAddress']);

        return Inertia::render('Vendor/Shipments/Show', [
            'shipment' => [
                'id' => $shipment->id,
                'tracking_number' => $shipment->tracking_number,
                'shipping_carrier' => $shipment->shipping_carrier,
                'shipping_method' => $shipment->shipping_method,
                'status' => $shipment->status,
                'weight' => $shipment->weight,
                'dimensions' => $shipment->dimensions,
                'shipping_cost' => $shipment->shipping_cost_in_dollars,
                'insurance_cost' => $shipment->insurance_cost_in_dollars,
                'shipped_at' => $shipment->shipped_at?->format('M d, Y g:i A'),
                'delivered_at' => $shipment->delivered_at?->format('M d, Y g:i A'),
                'label_url' => $shipment->label_url,
                'tracking_events' => $shipment->tracking_events ?? [],
                'tracking_url' => $this->trackingService->getTrackingUrl($shipment),
            ],
            'order' => [
                'id' => $shipment->order->id,
                'order_number' => $shipment->order->order_number,
                'customer_name' => $shipment->order->user->name ?? 'Guest',
                'shipping_address' => $shipment->order->shippingAddress ? [
                    'address_line1' => $shipment->order->shippingAddress->address_line1,
                    'address_line2' => $shipment->order->shippingAddress->address_line2,
                    'city' => $shipment->order->shippingAddress->city,
                    'state' => $shipment->order->shippingAddress->state,
                    'postal_code' => $shipment->order->shippingAddress->postal_code,
                    'country' => $shipment->order->shippingAddress->country,
                ] : null,
            ],
        ]);
    }

    /**
     * Generate and print shipping label.
     *
     * @param OrderShipment $shipment
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function printLabel(OrderShipment $shipment)
    {
        $vendor = auth()->user()->vendor;

        if (!$vendor || $shipment->vendor_id !== $vendor->id) {
            abort(403, 'You do not have permission to print this label');
        }

        try {
            $labelUrl = $this->trackingService->generateLabel($shipment);

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'label_url' => $labelUrl,
                ]);
            }

            return redirect($labelUrl);
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 500);
            }

            return back()->withErrors(['error' => 'Failed to generate label: ' . $e->getMessage()]);
        }
    }

    /**
     * Mark shipment as shipped.
     *
     * @param OrderShipment $shipment
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function markAsShipped(OrderShipment $shipment)
    {
        $vendor = auth()->user()->vendor;

        if (!$vendor || $shipment->vendor_id !== $vendor->id) {
            abort(403, 'You do not have permission to update this shipment');
        }

        if ($shipment->status === 'delivered') {
            return back()->withErrors(['error' => 'This shipment has already been delivered']);
        }

        try {
            $this->trackingService->markAsShipped($shipment);

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Shipment marked as shipped',
                ]);
            }

            return redirect()->route('vendor.shipments.show', $shipment)
                ->with('success', 'Shipment marked as shipped');
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 500);
            }

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Add a manual tracking event.
     *
     * @param Request $request
     * @param OrderShipment $shipment
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function addTrackingEvent(Request $request, OrderShipment $shipment)
    {
        $vendor = auth()->user()->vendor;

        if (!$vendor || $shipment->vendor_id !== $vendor->id) {
            abort(403, 'You do not have permission to update this shipment');
        }

        $request->validate([
            'status' => 'required|string',
            'description' => 'required|string',
            'location' => 'nullable|string',
        ]);

        try {
            if ($shipment->shipping_carrier === 'local') {
                $localCarrier = new LocalCarrier();
                $localCarrier->addManualTrackingEvent(
                    $shipment,
                    $request->status,
                    $request->description,
                    $request->location
                );

                // Update shipment status if needed
                if (in_array($request->status, ['delivered', 'out_for_delivery', 'in_transit'])) {
                    $shipment->update(['status' => $request->status]);
                }

                if ($request->status === 'delivered' && !$shipment->delivered_at) {
                    $shipment->update(['delivered_at' => now()]);
                }

                activity()
                    ->performedOn($shipment)
                    ->causedBy($request->user())
                    ->withProperties($request->only(['status', 'description', 'location']))
                    ->log('vendor_added_tracking_event');

                if (request()->expectsJson()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Tracking event added successfully',
                    ]);
                }

                return back()->with('success', 'Tracking event added successfully');
            } else {
                throw new \Exception('Manual tracking events are only supported for local carriers');
            }
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 500);
            }

            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get available carriers.
     *
     * @return array
     */
    protected function getAvailableCarriers(): array
    {
        return [
            ['value' => 'local', 'label' => 'Local Courier'],
            ['value' => 'dhl', 'label' => 'DHL'],
            ['value' => 'fedex', 'label' => 'FedEx'],
            ['value' => 'ups', 'label' => 'UPS'],
            ['value' => 'usps', 'label' => 'USPS'],
        ];
    }
}
