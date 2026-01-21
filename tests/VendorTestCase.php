<?php

declare(strict_types=1);

namespace Tests;

use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;

abstract class VendorTestCase extends TestCase
{
    protected User $vendor;
    protected Vendor $vendorProfile;

    /**
     * Setup the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Create vendor user
        $this->vendor = $this->createVendor();
        $this->vendorProfile = $this->vendor->vendor;

        // Authenticate as vendor
        $this->actingAs($this->vendor);
    }

    /**
     * Create a product for the authenticated vendor.
     */
    protected function createVendorProduct(array $attributes = []): Product
    {
        return Product::factory()->create(array_merge([
            'vendor_id' => $this->vendorProfile->id,
            'status' => 'active',
        ], $attributes));
    }

    /**
     * Create multiple products for the authenticated vendor.
     */
    protected function createVendorProducts(int $count, array $attributes = []): \Illuminate\Database\Eloquent\Collection
    {
        return Product::factory()->count($count)->create(array_merge([
            'vendor_id' => $this->vendorProfile->id,
            'status' => 'active',
        ], $attributes));
    }

    /**
     * Create an order with items from this vendor.
     */
    protected function createVendorOrder(array $orderAttributes = [], int $itemCount = 1): \App\Models\Order
    {
        $order = \App\Models\Order::factory()->create($orderAttributes);

        for ($i = 0; $i < $itemCount; $i++) {
            $product = $this->createVendorProduct();

            \App\Models\OrderItem::factory()->create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'vendor_id' => $this->vendorProfile->id,
            ]);
        }

        return $order->fresh(['items', 'items.product']);
    }

    /**
     * Assert vendor can access resource.
     */
    protected function assertVendorCanAccess(string $route, array $params = []): void
    {
        $response = $this->get(route($route, $params));
        $response->assertStatus(200);
    }

    /**
     * Assert vendor cannot access resource.
     */
    protected function assertVendorCannotAccess(string $route, array $params = []): void
    {
        $response = $this->get(route($route, $params));
        $response->assertStatus(403);
    }

    /**
     * Switch to a different vendor.
     */
    protected function switchToVendor(User $vendor): void
    {
        $this->vendor = $vendor;
        $this->vendorProfile = $vendor->vendor;
        $this->actingAs($vendor);
    }

    /**
     * Create a pending vendor (not approved).
     */
    protected function createPendingVendor(array $attributes = []): User
    {
        return $this->createVendor([], array_merge(['status' => 'pending'], $attributes));
    }

    /**
     * Create a suspended vendor.
     */
    protected function createSuspendedVendor(array $attributes = []): User
    {
        return $this->createVendor([], array_merge(['status' => 'suspended'], $attributes));
    }
}
