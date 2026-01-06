<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Vendor;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class VendorOrderService
{
    public function getVendorOrderItems(Vendor $vendor, Order $order): Collection
    {
        return $order->items()
            ->where('vendor_id', $vendor->id)
            ->with(['product', 'productVariant'])
            ->get();
    }

    public function calculateVendorOrderTotal(Vendor $vendor, Order $order): int
    {
        return $order->items()
            ->where('vendor_id', $vendor->id)
            ->sum('total_cents');
    }

    public function updateVendorItemStatus(Vendor $vendor, OrderItem $item, string $status, array $data = []): bool
    {
        if ($item->vendor_id !== $vendor->id) {
            throw new \Exception('This order item does not belong to your vendor account.');
        }

        $validStatuses = ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'refunded'];

        if (!in_array($status, $validStatuses)) {
            throw new \Exception('Invalid status provided.');
        }

        $updateData = ['vendor_status' => $status];

        if ($status === 'shipped') {
            $updateData['shipped_at'] = now();
            
            if (isset($data['tracking_number'])) {
                $updateData['tracking_number'] = $data['tracking_number'];
            }
            
            if (isset($data['carrier'])) {
                $updateData['carrier'] = $data['carrier'];
            }
            
            if (isset($data['estimated_delivery_at'])) {
                $updateData['estimated_delivery_at'] = $data['estimated_delivery_at'];
            }
        }

        if ($status === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        if (isset($data['vendor_notes'])) {
            $updateData['vendor_notes'] = $data['vendor_notes'];
        }

        $item->update($updateData);

        event(new \App\Events\OrderItemStatusUpdated($item, $status));

        $this->updateOverallOrderStatus($item->order);

        return true;
    }

    public function canVendorShip(Vendor $vendor, Order $order): bool
    {
        $vendorItems = $this->getVendorOrderItems($vendor, $order);

        if ($vendorItems->isEmpty()) {
            return false;
        }

        return $vendorItems->every(function ($item) {
            return in_array($item->vendor_status, ['confirmed', 'processing', 'ready_to_ship']);
        });
    }

    public function getVendorOrders(Vendor $vendor, array $filters = [])
    {
        $query = Order::whereHas('items', function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        })->with(['items' => function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        }, 'user']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['vendor_item_status'])) {
            $query->whereHas('items', function ($q) use ($vendor, $filters) {
                $q->where('vendor_id', $vendor->id)
                  ->where('vendor_status', $filters['vendor_item_status']);
            });
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('created_at', 'desc');
    }

    protected function updateOverallOrderStatus(Order $order): void
    {
        $allItems = $order->items;
        
        $allShipped = $allItems->every(fn($item) => $item->vendor_status === 'shipped');
        $allDelivered = $allItems->every(fn($item) => $item->vendor_status === 'delivered');
        $anyProcessing = $allItems->contains(fn($item) => $item->vendor_status === 'processing');

        if ($allDelivered) {
            $order->update(['status' => 'delivered']);
        } elseif ($allShipped) {
            $order->update(['status' => 'shipped']);
        } elseif ($anyProcessing) {
            $order->update(['status' => 'processing']);
        }
    }

    public function addShipmentTracking(Vendor $vendor, Order $order, array $data): bool
    {
        $vendorItems = $this->getVendorOrderItems($vendor, $order);

        if ($vendorItems->isEmpty()) {
            throw new \Exception('No items found for your vendor in this order.');
        }

        DB::transaction(function () use ($vendorItems, $data) {
            foreach ($vendorItems as $item) {
                if (in_array($item->vendor_status, ['ready_to_ship', 'processing'])) {
                    $item->update([
                        'vendor_status' => 'shipped',
                        'carrier' => $data['carrier'],
                        'tracking_number' => $data['tracking_number'],
                        'shipped_at' => now(),
                        'estimated_delivery_at' => $data['estimated_delivery_at'] ?? null,
                    ]);

                    event(new \App\Events\OrderItemStatusUpdated($item, 'shipped'));
                }
            }
        });

        $this->updateOverallOrderStatus($order);

        return true;
    }

    public function bulkUpdateItemStatus(Vendor $vendor, array $itemIds, string $status): int
    {
        $items = OrderItem::whereIn('id', $itemIds)
            ->where('vendor_id', $vendor->id)
            ->get();

        $updated = 0;

        foreach ($items as $item) {
            try {
                $this->updateVendorItemStatus($vendor, $item, $status);
                $updated++;
            } catch (\Exception $e) {
                continue;
            }
        }

        return $updated;
    }
}
