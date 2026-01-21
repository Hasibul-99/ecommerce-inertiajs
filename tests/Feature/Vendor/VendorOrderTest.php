<?php

declare(strict_types=1);

namespace Tests\Feature\Vendor;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\VendorTestCase;

class VendorOrderTest extends VendorTestCase
{
    use RefreshDatabase;

    /** @test */
    public function vendor_can_view_their_orders(): void
    {
        // Create orders with items from this vendor
        $order1 = $this->createVendorOrder([], 2);
        $order2 = $this->createVendorOrder([], 1);

        $response = $this->get(route('vendor.orders.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Vendor/Orders/Index')
            ->has('orders.data', 2)
        );
    }

    /** @test */
    public function vendor_only_sees_their_order_items(): void
    {
        $order = Order::factory()->create();

        // Create item for this vendor
        $myProduct = $this->createVendorProduct();
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $myProduct->id,
            'vendor_id' => $this->vendorProfile->id,
        ]);

        // Create item for another vendor
        $otherVendor = $this->createVendor();
        $otherProduct = \App\Models\Product::factory()->create([
            'vendor_id' => $otherVendor->vendor->id,
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $otherProduct->id,
            'vendor_id' => $otherVendor->vendor->id,
        ]);

        $response = $this->get(route('vendor.orders.show', $order));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Vendor/Orders/Show')
            ->has('order.items', 1)
            ->where('order.items.0.vendor_id', $this->vendorProfile->id)
        );
    }

    /** @test */
    public function vendor_can_update_order_item_status(): void
    {
        $order = $this->createVendorOrder();
        $orderItem = $order->items->first();

        $response = $this->patch(route('vendor.orders.items.update-status', [$order, $orderItem]), [
            'status' => 'processing',
        ]);

        $response->assertRedirect();

        $this->assertEquals('processing', $orderItem->fresh()->status);
    }

    /** @test */
    public function vendor_cannot_update_other_vendors_order_items(): void
    {
        $otherVendor = $this->createVendor();
        $order = Order::factory()->create();
        $otherProduct = \App\Models\Product::factory()->create([
            'vendor_id' => $otherVendor->vendor->id,
        ]);
        $orderItem = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $otherProduct->id,
            'vendor_id' => $otherVendor->vendor->id,
            'status' => 'pending',
        ]);

        $response = $this->patch(route('vendor.orders.items.update-status', [$order, $orderItem]), [
            'status' => 'processing',
        ]);

        $response->assertForbidden();
        $this->assertEquals('pending', $orderItem->fresh()->status);
    }

    /** @test */
    public function vendor_can_add_tracking_information(): void
    {
        $order = $this->createVendorOrder();
        $orderItem = $order->items->first();

        $response = $this->post(route('vendor.orders.add-tracking', $order), [
            'order_item_id' => $orderItem->id,
            'tracking_number' => 'TRACK123456',
            'carrier' => 'UPS',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('order_items', [
            'id' => $orderItem->id,
            'tracking_number' => 'TRACK123456',
            'carrier' => 'UPS',
        ]);
    }

    /** @test */
    public function vendor_can_mark_order_item_as_shipped(): void
    {
        $order = $this->createVendorOrder();
        $orderItem = $order->items->first();

        $response = $this->post(route('vendor.orders.mark-shipped', [$order, $orderItem]), [
            'tracking_number' => 'SHIP789',
            'carrier' => 'FedEx',
        ]);

        $response->assertRedirect();

        $this->assertEquals('shipped', $orderItem->fresh()->status);
        $this->assertEquals('SHIP789', $orderItem->fresh()->tracking_number);
    }

    /** @test */
    public function vendor_can_filter_orders_by_status(): void
    {
        // Create orders with different statuses
        $order1 = $this->createVendorOrder(['status' => 'pending']);
        $order2 = $this->createVendorOrder(['status' => 'processing']);
        $order3 = $this->createVendorOrder(['status' => 'completed']);

        $response = $this->get(route('vendor.orders.index', ['status' => 'processing']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('orders.data', 1));
    }

    /** @test */
    public function vendor_can_search_orders_by_order_number(): void
    {
        $order1 = $this->createVendorOrder(['order_number' => 'ORD-12345']);
        $order2 = $this->createVendorOrder(['order_number' => 'ORD-67890']);

        $response = $this->get(route('vendor.orders.index', ['search' => 'ORD-12345']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('orders.data', 1));
    }

    /** @test */
    public function vendor_can_view_order_details(): void
    {
        $order = $this->createVendorOrder([], 2);

        $response = $this->get(route('vendor.orders.show', $order));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Vendor/Orders/Show')
            ->has('order')
            ->has('order.items', 2)
        );
    }

    /** @test */
    public function vendor_can_print_packing_slip(): void
    {
        $order = $this->createVendorOrder();

        $response = $this->get(route('vendor.orders.packing-slip', $order));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    /** @test */
    public function vendor_can_export_orders_to_csv(): void
    {
        $this->createVendorOrder();
        $this->createVendorOrder();

        $response = $this->get(route('vendor.orders.export', ['format' => 'csv']));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv');
    }

    /** @test */
    public function vendor_sees_order_statistics_on_dashboard(): void
    {
        $this->createVendorOrder(['status' => 'pending']);
        $this->createVendorOrder(['status' => 'processing']);
        $this->createVendorOrder(['status' => 'completed']);

        $response = $this->get(route('vendor.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('stats')
            ->has('stats.total_orders')
            ->has('stats.pending_orders')
            ->has('stats.completed_orders')
        );
    }

    /** @test */
    public function vendor_cannot_view_orders_from_other_vendors(): void
    {
        $otherVendor = $this->createVendor();
        $otherOrder = Order::factory()->create();
        $otherProduct = \App\Models\Product::factory()->create([
            'vendor_id' => $otherVendor->vendor->id,
        ]);
        OrderItem::factory()->create([
            'order_id' => $otherOrder->id,
            'product_id' => $otherProduct->id,
            'vendor_id' => $otherVendor->vendor->id,
        ]);

        $response = $this->get(route('vendor.orders.show', $otherOrder));

        $response->assertForbidden();
    }

    /** @test */
    public function vendor_receives_notification_for_new_orders(): void
    {
        $order = $this->createVendorOrder();

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->vendor->id,
            'notifiable_type' => \App\Models\User::class,
        ]);
    }
}
