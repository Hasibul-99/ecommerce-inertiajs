<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\VendorOrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $vendorOrderService;

    public function __construct(VendorOrderService $vendorOrderService)
    {
        $this->middleware(['auth', 'verified', 'role:vendor']);
        $this->vendorOrderService = $vendorOrderService;
    }

    /**
     * Display a listing of orders containing vendor's items.
     */
    public function index(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.register')
                ->with('error', 'Please complete vendor registration first.');
        }

        $query = Order::with(['user', 'items' => function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id)
                  ->with(['product', 'productVariant']);
        }])
        ->whereHas('items', function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        });

        // Filter by status
        if ($request->status) {
            $query->whereHas('items', function ($q) use ($vendor, $request) {
                $q->where('vendor_id', $vendor->id)
                  ->where('vendor_status', $request->status);
            });
        }

        // Filter by date range
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by order number or customer name
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function ($userQuery) use ($request) {
                      $userQuery->where('name', 'like', "%{$request->search}%")
                                ->orWhere('email', 'like', "%{$request->search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')
                       ->paginate(20)
                       ->withQueryString();

        // Transform orders to include vendor-specific data
        $orders->getCollection()->transform(function ($order) use ($vendor) {
            $vendorItems = $order->items->where('vendor_id', $vendor->id);

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name,
                'customer_email' => $order->user->email,
                'total_items' => $vendorItems->count(),
                'vendor_total_cents' => $vendorItems->sum(function ($item) {
                    return $item->price_at_purchase_cents * $item->quantity;
                }),
                'status' => $order->status,
                'vendor_items_status' => $vendorItems->pluck('vendor_status')->unique()->values(),
                'all_items_shipped' => $vendorItems->every(fn($item) => $item->isShipped()),
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $order->updated_at->format('Y-m-d H:i:s'),
            ];
        });

        // Calculate stats
        $stats = [
            'total_orders' => Order::whereHas('items', function ($q) use ($vendor) {
                $q->where('vendor_id', $vendor->id);
            })->count(),
            'pending' => OrderItem::where('vendor_id', $vendor->id)
                                  ->where('vendor_status', 'pending')
                                  ->distinct('order_id')
                                  ->count(),
            'processing' => OrderItem::where('vendor_id', $vendor->id)
                                    ->whereIn('vendor_status', ['confirmed', 'processing', 'ready_to_ship'])
                                    ->distinct('order_id')
                                    ->count(),
            'shipped' => OrderItem::where('vendor_id', $vendor->id)
                                  ->where('vendor_status', 'shipped')
                                  ->distinct('order_id')
                                  ->count(),
            'delivered' => OrderItem::where('vendor_id', $vendor->id)
                                    ->where('vendor_status', 'delivered')
                                    ->distinct('order_id')
                                    ->count(),
        ];

        return Inertia::render('Vendor/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified order with vendor's items.
     */
    public function show(Order $order)
    {
        $vendor = Auth::user()->vendor;

        // Verify vendor has items in this order
        $hasItems = $order->items()->where('vendor_id', $vendor->id)->exists();
        if (!$hasItems) {
            abort(404, 'Order not found or you do not have access to this order.');
        }

        $order->load([
            'user',
            'items' => function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id)
                      ->with(['product', 'productVariant']);
            },
        ]);

        // Calculate vendor-specific totals
        $vendorItems = $order->items;
        $vendorTotal = $vendorItems->sum(function ($item) {
            return $item->price_at_purchase_cents * $item->quantity;
        });

        $orderData = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer' => [
                'name' => $order->user->name,
                'email' => $order->user->email,
            ],
            'shipping_address' => [
                'street' => $order->shipping_street,
                'city' => $order->shipping_city,
                'state' => $order->shipping_state,
                'postal_code' => $order->shipping_postal_code,
                'country' => $order->shipping_country,
            ],
            'items' => $vendorItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product->title,
                    'variant_name' => $item->productVariant?->name,
                    'sku' => $item->productVariant?->sku ?? $item->product->sku,
                    'quantity' => $item->quantity,
                    'price_cents' => $item->price_at_purchase_cents,
                    'total_cents' => $item->price_at_purchase_cents * $item->quantity,
                    'vendor_status' => $item->vendor_status,
                    'carrier' => $item->carrier,
                    'tracking_number' => $item->tracking_number,
                    'shipped_at' => $item->shipped_at?->format('Y-m-d H:i:s'),
                    'estimated_delivery_at' => $item->estimated_delivery_at?->format('Y-m-d H:i:s'),
                    'delivered_at' => $item->delivered_at?->format('Y-m-d H:i:s'),
                    'vendor_notes' => $item->vendor_notes,
                    'can_ship' => $item->canBeShipped(),
                    'is_shipped' => $item->isShipped(),
                ];
            }),
            'vendor_total_cents' => $vendorTotal,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'created_at' => $order->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $order->updated_at->format('Y-m-d H:i:s'),
        ];

        return Inertia::render('Vendor/Orders/Show', [
            'order' => $orderData,
        ]);
    }

    /**
     * Update the status of a specific order item.
     */
    public function updateItemStatus(Request $request, OrderItem $orderItem)
    {
        $vendor = Auth::user()->vendor;

        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,ready_to_ship,shipped,delivered,cancelled,refunded',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $data = [];
            if ($request->notes) {
                $data['notes'] = $request->notes;
            }

            $this->vendorOrderService->updateVendorItemStatus(
                $vendor,
                $orderItem,
                $request->status,
                $data
            );

            activity()
                ->performedOn($orderItem)
                ->causedBy(Auth::user())
                ->withProperties([
                    'status' => $request->status,
                    'notes' => $request->notes,
                ])
                ->log('Vendor updated order item status');

            return redirect()->back()->with('success', 'Order item status updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Add shipment tracking to vendor's items in an order.
     */
    public function addShipmentTracking(Request $request, Order $order)
    {
        $vendor = Auth::user()->vendor;

        $request->validate([
            'item_ids' => 'required|array',
            'item_ids.*' => 'required|exists:order_items,id',
            'carrier' => 'required|string|max:100',
            'tracking_number' => 'required|string|max:100',
            'estimated_delivery_date' => 'nullable|date|after:today',
        ]);

        try {
            DB::transaction(function () use ($request, $order, $vendor) {
                foreach ($request->item_ids as $itemId) {
                    $item = OrderItem::findOrFail($itemId);

                    // Verify item belongs to vendor
                    if ($item->vendor_id !== $vendor->id) {
                        throw new \Exception('Unauthorized access to order item.');
                    }

                    // Verify item can be shipped
                    if (!$item->canBeShipped()) {
                        throw new \Exception("Order item #{$item->id} cannot be shipped in its current status.");
                    }

                    $trackingData = [
                        'carrier' => $request->carrier,
                        'tracking_number' => $request->tracking_number,
                    ];

                    if ($request->estimated_delivery_date) {
                        $trackingData['estimated_delivery_date'] = $request->estimated_delivery_date;
                    }

                    $this->vendorOrderService->addShipmentTracking(
                        $vendor,
                        $item,
                        $trackingData
                    );
                }
            });

            activity()
                ->performedOn($order)
                ->causedBy(Auth::user())
                ->withProperties([
                    'carrier' => $request->carrier,
                    'tracking_number' => $request->tracking_number,
                    'item_count' => count($request->item_ids),
                ])
                ->log('Vendor added shipment tracking');

            return redirect()->back()->with('success', 'Shipment tracking added successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Export vendor orders to CSV.
     */
    public function exportOrders(Request $request)
    {
        $vendor = Auth::user()->vendor;

        $query = Order::with(['user', 'items' => function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id)
                  ->with(['product', 'productVariant']);
        }])
        ->whereHas('items', function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        });

        // Apply same filters as index
        if ($request->status) {
            $query->whereHas('items', function ($q) use ($vendor, $request) {
                $q->where('vendor_id', $vendor->id)
                  ->where('vendor_status', $request->status);
            });
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'vendor_orders_' . $vendor->id . '_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($orders, $vendor) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'Order Number',
                'Customer Name',
                'Customer Email',
                'Product',
                'Variant',
                'SKU',
                'Quantity',
                'Price',
                'Total',
                'Status',
                'Carrier',
                'Tracking Number',
                'Shipped At',
                'Order Date',
            ]);

            // CSV Data
            foreach ($orders as $order) {
                foreach ($order->items as $item) {
                    if ($item->vendor_id === $vendor->id) {
                        fputcsv($file, [
                            $order->order_number,
                            $order->user->name,
                            $order->user->email,
                            $item->product->title,
                            $item->productVariant?->name ?? 'N/A',
                            $item->productVariant?->sku ?? $item->product->sku ?? 'N/A',
                            $item->quantity,
                            number_format($item->price_at_purchase_cents / 100, 2),
                            number_format(($item->price_at_purchase_cents * $item->quantity) / 100, 2),
                            $item->vendor_status,
                            $item->carrier ?? 'N/A',
                            $item->tracking_number ?? 'N/A',
                            $item->shipped_at?->format('Y-m-d H:i:s') ?? 'N/A',
                            $order->created_at->format('Y-m-d H:i:s'),
                        ]);
                    }
                }
            }

            fclose($file);
        };

        activity()
            ->causedBy(Auth::user())
            ->log('Vendor exported orders');

        return response()->stream($callback, 200, $headers);
    }
}
