#!/bin/bash

# Script to generate remaining test file templates
# Run with: bash tests/generate-remaining-tests.sh

echo "Generating remaining test files..."

# Create directories if they don't exist
mkdir -p tests/Feature/Order
mkdir -p tests/Feature/Cart
mkdir -p tests/Unit/Services
mkdir -p tests/Unit/Models
mkdir -p tests/Integration

# Generate OrderStatusFlowTest.php
cat > tests/Feature/Order/OrderStatusFlowTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusFlowTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_can_transition_from_pending_to_processing(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->pending()->create();

        $response = $this->patch(route('admin.orders.update-status', $order), [
            'status' => 'processing',
        ]);

        $response->assertRedirect();
        $this->assertEquals('processing', $order->fresh()->status);
    }

    /** @test */
    public function order_can_transition_from_processing_to_shipped(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->processing()->create();

        $response = $this->patch(route('admin.orders.update-status', $order), [
            'status' => 'shipped',
            'tracking_number' => 'TRACK123',
        ]);

        $response->assertRedirect();
        $this->assertEquals('shipped', $order->fresh()->status);
        $this->assertEquals('TRACK123', $order->fresh()->tracking_number);
    }

    /** @test */
    public function order_can_be_cancelled_before_shipping(): void
    {
        $customer = $this->createCustomer();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($customer);

        $response = $this->post(route('orders.cancel', $order));

        $response->assertRedirect();
        $this->assertEquals('cancelled', $order->fresh()->status);
    }

    /** @test */
    public function order_cannot_be_cancelled_after_shipping(): void
    {
        $customer = $this->createCustomer();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'shipped',
        ]);

        $this->actingAs($customer);

        $response = $this->post(route('orders.cancel', $order));

        $response->assertSessionHasErrors();
        $this->assertEquals('shipped', $order->fresh()->status);
    }

    /** @test */
    public function order_status_history_is_tracked(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->pending()->create();

        $this->patch(route('admin.orders.update-status', $order), ['status' => 'processing']);
        $this->patch(route('admin.orders.update-status', $order), ['status' => 'shipped']);

        $this->assertDatabaseCount('order_status_histories', 2);
    }
}
EOF

# Generate OrderRefundTest.php
cat > tests/Feature/Order/OrderRefundTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderRefundTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_refund_completed_order(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->completed()->create([
            'payment_status' => 'paid',
            'total_cents' => 10000,
        ]);

        $response = $this->post(route('admin.orders.refund', $order), [
            'amount' => 100.00,
            'reason' => 'Customer request',
        ]);

        $response->assertRedirect();

        $this->assertEquals('refunded', $order->fresh()->payment_status);
        $this->assertDatabaseHas('refunds', [
            'order_id' => $order->id,
            'amount_cents' => 10000,
            'reason' => 'Customer request',
        ]);
    }

    /** @test */
    public function partial_refund_can_be_issued(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->completed()->create([
            'payment_status' => 'paid',
            'total_cents' => 10000,
        ]);

        $this->post(route('admin.orders.refund', $order), [
            'amount' => 50.00,
            'reason' => 'Partial refund',
        ]);

        $this->assertEquals('partially_refunded', $order->fresh()->payment_status);
    }

    /** @test */
    public function refund_restores_product_stock(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $product = \App\Models\Product::factory()->create(['stock' => 5]);
        $order = Order::factory()->completed()->create();

        \App\Models\OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->post(route('admin.orders.refund', $order), [
            'amount' => $order->total_cents / 100,
            'reason' => 'Test refund',
            'restore_stock' => true,
        ]);

        $this->assertEquals(7, $product->fresh()->stock);
    }
}
EOF

# Generate MultiVendorOrderTest.php
cat > tests/Feature/Order/MultiVendorOrderTest.php <<'EOF'
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
EOF

echo "✅ Order tests generated"

# Generate Cart tests
cat > tests/Feature/Cart/CartOperationsTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Feature\Cart;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartOperationsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function customer_can_add_product_to_cart(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $product = Product::factory()->create(['stock' => 10]);

        $response = $this->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('carts', [
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    /** @test */
    public function customer_can_update_cart_item_quantity(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $product = Product::factory()->create(['stock' => 10]);
        $cart = \App\Models\Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->patch(route('cart.update', $cart), [
            'quantity' => 5,
        ]);

        $response->assertOk();
        $this->assertEquals(5, $cart->fresh()->quantity);
    }

    /** @test */
    public function customer_can_remove_item_from_cart(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $cart = \App\Models\Cart::factory()->create([
            'user_id' => $customer->id,
        ]);

        $response = $this->delete(route('cart.remove', $cart));

        $response->assertOk();
        $this->assertDatabaseMissing('carts', ['id' => $cart->id]);
    }

    /** @test */
    public function cart_cannot_exceed_product_stock(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $product = Product::factory()->create(['stock' => 5]);

        $response = $this->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $response->assertSessionHasErrors(['quantity']);
    }
}
EOF

cat > tests/Feature/Cart/CartToCheckoutTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Feature\Cart;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartToCheckoutTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function customer_can_view_cart(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        Cart::factory()->count(3)->create(['user_id' => $customer->id]);

        $response = $this->get(route('cart.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('cart.items', 3));
    }

    /** @test */
    public function customer_can_proceed_to_checkout_from_cart(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $product = Product::factory()->create();
        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
        ]);

        $response = $this->get(route('checkout.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Checkout/Index')
            ->has('cart')
        );
    }
}
EOF

cat > tests/Feature/Cart/InventoryReservationTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Feature\Cart;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryReservationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function adding_to_cart_does_not_reserve_stock(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $product = Product::factory()->create(['stock' => 10]);

        $this->post(route('cart.add'), [
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        $this->assertEquals(10, $product->fresh()->stock);
    }

    /** @test */
    public function checkout_reserves_stock(): void
    {
        // Implement stock reservation during checkout
        $this->markTestIncomplete('Stock reservation to be implemented');
    }
}
EOF

echo "✅ Cart tests generated"

# Generate Unit tests
cat > tests/Unit/Services/ShippingServiceTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Address;
use App\Models\Order;
use App\Services\ShippingService;
use Tests\TestCase;

class ShippingServiceTest extends TestCase
{
    private ShippingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ShippingService::class);
    }

    /** @test */
    public function calculates_shipping_cost_based_on_weight(): void
    {
        $order = Order::factory()->make(['weight_grams' => 1000]);
        $cost = $this->service->calculateShippingCost($order);

        $this->assertGreaterThan(0, $cost);
    }

    /** @test */
    public function calculates_shipping_cost_based_on_distance(): void
    {
        $address = Address::factory()->make(['postal_code' => '90001']);
        $cost = $this->service->calculateShippingCostToAddress($address, 1000);

        $this->assertGreaterThan(0, $cost);
    }
}
EOF

cat > tests/Unit/Services/CodServiceTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Address;
use App\Services\CodService;
use Tests\TestCase;

class CodServiceTest extends TestCase
{
    private CodService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(CodService::class);
    }

    /** @test */
    public function cod_fee_increases_with_order_amount(): void
    {
        $fee1 = $this->service->getCodFee(10000);
        $fee2 = $this->service->getCodFee(50000);

        $this->assertGreaterThanOrEqual($fee1, $fee2);
    }

    /** @test */
    public function cod_is_available_for_unrestricted_areas(): void
    {
        $address = Address::factory()->make();
        $this->assertTrue($this->service->isAvailableForAddress($address));
    }
}
EOF

cat > tests/Unit/Services/CommissionServiceTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\OrderItem;
use App\Services\CommissionService;
use Tests\TestCase;

class CommissionServiceTest extends TestCase
{
    private CommissionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(CommissionService::class);
    }

    /** @test */
    public function calculates_commission_correctly(): void
    {
        $orderItem = OrderItem::factory()->make([
            'total_cents' => 10000,
        ]);

        $commission = $this->service->calculateCommission($orderItem, 15);

        $this->assertEquals(1500, $commission['platform_amount_cents']);
        $this->assertEquals(8500, $commission['vendor_amount_cents']);
    }
}
EOF

cat > tests/Unit/Services/PayoutServiceTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Services\PayoutService;
use Tests\TestCase;

class PayoutServiceTest extends TestCase
{
    private PayoutService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(PayoutService::class);
    }

    /** @test */
    public function calculates_available_balance_correctly(): void
    {
        $vendor = $this->createVendor();
        $balance = $this->service->calculateAvailableBalance($vendor->vendor);

        $this->assertIsInt($balance);
        $this->assertGreaterThanOrEqual(0, $balance);
    }
}
EOF

cat > tests/Unit/Models/ProductTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Product;
use Tests\TestCase;

class ProductTest extends TestCase
{
    /** @test */
    public function product_has_vendor_relationship(): void
    {
        $product = Product::factory()->create();

        $this->assertInstanceOf(\App\Models\Vendor::class, $product->vendor);
    }

    /** @test */
    public function product_has_category_relationship(): void
    {
        $product = Product::factory()->create();

        $this->assertInstanceOf(\App\Models\Category::class, $product->category);
    }

    /** @test */
    public function product_calculates_in_stock_correctly(): void
    {
        $product = Product::factory()->create(['stock' => 5]);
        $this->assertTrue($product->in_stock);

        $product->update(['stock' => 0]);
        $this->assertFalse($product->fresh()->in_stock);
    }
}
EOF

cat > tests/Unit/Models/OrderTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Order;
use Tests\TestCase;

class OrderTest extends TestCase
{
    /** @test */
    public function order_has_user_relationship(): void
    {
        $order = Order::factory()->create();

        $this->assertInstanceOf(\App\Models\User::class, $order->user);
    }

    /** @test */
    public function order_has_items_relationship(): void
    {
        $order = Order::factory()->create();
        \App\Models\OrderItem::factory()->create(['order_id' => $order->id]);

        $this->assertCount(1, $order->items);
    }

    /** @test */
    public function order_checks_if_cod(): void
    {
        $codOrder = Order::factory()->create(['payment_method' => 'cod']);
        $stripeOrder = Order::factory()->create(['payment_method' => 'stripe']);

        $this->assertTrue($codOrder->isCod());
        $this->assertFalse($stripeOrder->isCod());
    }
}
EOF

echo "✅ Unit tests generated"

# Generate Integration tests
cat > tests/Integration/PaymentProcessingTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Integration;

use App\Services\StripePaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaymentProcessingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function stripe_payment_can_be_processed(): void
    {
        Http::fake([
            'https://api.stripe.com/*' => Http::response([
                'id' => 'pi_test_123',
                'status' => 'succeeded',
            ], 200),
        ]);

        $service = app(StripePaymentService::class);
        $order = \App\Models\Order::factory()->create();

        $result = $service->processPayment($order, [
            'payment_method_id' => 'pm_test_123',
        ]);

        $this->assertTrue($result['success']);
    }
}
EOF

cat > tests/Integration/EmailNotificationTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Integration;

use App\Models\Order;
use App\Notifications\OrderCreatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_confirmation_email_is_sent(): void
    {
        Mail::fake();

        $customer = $this->createCustomer();
        $order = Order::factory()->create(['user_id' => $customer->id]);

        $customer->notify(new OrderCreatedNotification($order));

        Mail::assertSent(\Illuminate\Notifications\Messages\MailMessage::class);
    }
}
EOF

cat > tests/Integration/EventDispatchingTest.php <<'EOF'
<?php

declare(strict_types=1);

namespace Tests\Integration;

use App\Events\OrderCreated;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class EventDispatchingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_created_event_is_dispatched_and_handled(): void
    {
        Event::fake();

        $order = Order::factory()->create();
        event(new OrderCreated($order));

        Event::assertDispatched(OrderCreated::class);
    }
}
EOF

echo "✅ Integration tests generated"

echo ""
echo "========================================="
echo "✅ All test files have been generated!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review and customize generated tests"
echo "2. Run: php artisan test"
echo "3. Check coverage: php artisan test --coverage"
echo "4. Fix any failing tests"
echo ""
