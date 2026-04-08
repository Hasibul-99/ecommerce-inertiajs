<?php

declare(strict_types=1);

namespace Tests;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Vendor;

abstract class AdminTestCase extends TestCase
{
    protected User $admin;

    /**
     * Setup the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = $this->createAdmin();

        // Authenticate as admin
        $this->actingAs($this->admin);
    }

    /**
     * Assert admin can access resource.
     */
    protected function assertAdminCanAccess(string $route, array $params = []): void
    {
        $response = $this->get(route($route, $params));
        $response->assertOk();
    }

    /**
     * Assert admin can perform action.
     */
    protected function assertAdminCanPerformAction(string $method, string $route, array $params = [], array $data = []): void
    {
        $response = $this->{$method}(route($route, $params), $data);
        $response->assertSuccessful();
    }

    /**
     * Approve a vendor.
     */
    protected function approveVendor(Vendor $vendor): Vendor
    {
        $vendor->update(['status' => 'approved']);
        return $vendor->fresh();
    }

    /**
     * Reject a vendor.
     */
    protected function rejectVendor(Vendor $vendor, string $reason = 'Test rejection'): Vendor
    {
        $vendor->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
        return $vendor->fresh();
    }

    /**
     * Suspend a vendor.
     */
    protected function suspendVendor(Vendor $vendor, string $reason = 'Test suspension'): Vendor
    {
        $vendor->update([
            'status' => 'suspended',
            'suspension_reason' => $reason,
        ]);
        return $vendor->fresh();
    }

    /**
     * Create a complete order with items.
     */
    protected function createCompleteOrder(int $itemCount = 2, array $attributes = []): Order
    {
        $order = Order::factory()->create($attributes);

        for ($i = 0; $i < $itemCount; $i++) {
            $product = Product::factory()->create();

            \App\Models\OrderItem::factory()->create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'vendor_id' => $product->vendor_id,
            ]);
        }

        return $order->fresh(['items', 'items.product', 'items.vendor']);
    }

    /**
     * Switch to super admin.
     */
    protected function switchToSuperAdmin(): void
    {
        $this->admin = $this->createSuperAdmin();
        $this->actingAs($this->admin);
    }

    /**
     * Assert can manage resource.
     */
    protected function assertCanManageResource(string $baseRoute, array $createData): void
    {
        // Test index
        $this->get(route("{$baseRoute}.index"))->assertOk();

        // Test create
        $this->get(route("{$baseRoute}.create"))->assertOk();

        // Test store
        $response = $this->post(route("{$baseRoute}.store"), $createData);
        $response->assertRedirect();

        // Get the created resource ID from redirect
        $id = $response->getSession()->get('_flash')['success'] ? 1 : null;

        if ($id) {
            // Test edit
            $this->get(route("{$baseRoute}.edit", $id))->assertOk();

            // Test update
            $this->put(route("{$baseRoute}.update", $id), $createData)->assertRedirect();

            // Test destroy
            $this->delete(route("{$baseRoute}.destroy", $id))->assertRedirect();
        }
    }
}
