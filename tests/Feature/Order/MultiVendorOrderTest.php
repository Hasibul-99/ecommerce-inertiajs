<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiVendorOrderTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_can_contain_items_from_multiple_vendors(): void
    {
        $vendor1 = $this->createVendor();
        $vendor2 = $this->createVendor();

        $product1 = Product::factory()->create(['vendor_id' => $vendor1->vendor->id]);
        $product2 = Product::factory()->create(['vendor_id' => $vendor2->vendor->id]);

        $order = Order::factory()->create();

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product1->id,
            'vendor_id' => $vendor1->vendor->id,
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product2->id,
            'vendor_id' => $vendor2->vendor->id,
        ]);

        $vendorIds = $order->items->pluck('vendor_id')->unique();
        $this->assertCount(2, $vendorIds);
    }

    /** @test */
    public function each_vendor_only_sees_their_items_in_multi_vendor_order(): void
    {
        $vendor1 = $this->createVendor();
        $vendor2 = $this->createVendor();

        $product1 = Product::factory()->create(['vendor_id' => $vendor1->vendor->id]);
        $product2 = Product::factory()->create(['vendor_id' => $vendor2->vendor->id]);

        $order = Order::factory()->create();

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product1->id,
            'vendor_id' => $vendor1->vendor->id,
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product2->id,
            'vendor_id' => $vendor2->vendor->id,
        ]);

        $this->actingAs($vendor1);
        $response = $this->get(route('vendor.orders.show', $order));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('order.items', 1)
            ->where('order.items.0.vendor_id', $vendor1->vendor->id)
        );
    }

    /** @test */
    public function commission_is_calculated_per_vendor_per_item(): void
    {
        $vendor1 = $this->createVendor();
        $vendor2 = $this->createVendor();

        $order = Order::factory()->completed()->create();

        $item1 = OrderItem::factory()->create([
            'order_id' => $order->id,
            'vendor_id' => $vendor1->vendor->id,
            'total_cents' => 10000,
        ]);

        $item2 = OrderItem::factory()->create([
            'order_id' => $order->id,
            'vendor_id' => $vendor2->vendor->id,
            'total_cents' => 15000,
        ]);

        $this->assertDatabaseHas('commissions', ['order_item_id' => $item1->id]);
        $this->assertDatabaseHas('commissions', ['order_item_id' => $item2->id]);
    }
}
