<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function customer_can_create_order_from_cart(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'user_id' => $customer->id,
            'payment_method' => 'stripe',
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->assertDatabaseCount('carts', 0);
    }

    /** @test */
    public function order_creation_decreases_product_stock(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $this->assertEquals(7, $product->fresh()->stock);
    }

    /** @test */
    public function order_creation_fails_if_insufficient_stock(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 2]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 5,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseCount('orders', 0);
        $this->assertEquals(2, $product->fresh()->stock);
    }

    /** @test */
    public function order_can_apply_valid_coupon(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        $coupon = Coupon::factory()->create([
            'coupon_code' => 'SAVE10',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'is_active' => true,
            'expires_at' => now()->addDays(30),
        ]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
            'coupon_code' => 'SAVE10',
        ]);

        $response->assertRedirect();

        $order = $customer->orders()->first();
        $this->assertNotNull($order);
        $this->assertEquals('SAVE10', $order->coupon_code);
        $this->assertGreaterThan(0, $order->discount_cents);
    }

    /** @test */
    public function order_creation_fails_with_expired_coupon(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        $coupon = Coupon::factory()->create([
            'coupon_code' => 'EXPIRED',
            'expires_at' => now()->subDays(1),
        ]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
            'coupon_code' => 'EXPIRED',
        ]);

        $response->assertSessionHasErrors(['coupon_code']);
    }

    /** @test */
    public function order_totals_are_calculated_correctly(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product1 = Product::factory()->create(['price' => 10000]); // $100
        $product2 = Product::factory()->create(['price' => 15000]); // $150

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product1->id,
            'quantity' => 2, // $200
        ]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product2->id,
            'quantity' => 1, // $150
        ]);

        $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $order = $customer->orders()->first();

        // Subtotal should be $350 (35000 cents)
        $this->assertEquals(35000, $order->subtotal_cents);

        // Total should include tax and shipping
        $this->assertGreaterThan(35000, $order->total_cents);
    }

    /** @test */
    public function order_requires_shipping_address(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $product = Product::factory()->create();
        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
        ]);

        $response->assertSessionHasErrors(['shipping_address_id']);
    }

    /** @test */
    public function order_generates_unique_order_number(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['stock' => 10]);

        for ($i = 0; $i < 3; $i++) {
            Cart::factory()->create([
                'user_id' => $customer->id,
                'product_id' => $product->id,
                'quantity' => 1,
            ]);

            $this->post(route('checkout.process'), [
                'payment_method' => 'stripe',
                'shipping_address_id' => $address->id,
                'billing_address_id' => $address->id,
            ]);
        }

        $orderNumbers = $customer->orders()->pluck('order_number')->unique();
        $this->assertCount(3, $orderNumbers);
    }

    /** @test */
    public function order_creation_dispatches_event(): void
    {
        Event::fake();

        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create();

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
        ]);

        $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        Event::assertDispatched(\App\Events\OrderCreated::class);
    }

    /** @test */
    public function customer_receives_order_confirmation_notification(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create();

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
        ]);

        $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $customer->id,
            'notifiable_type' => \App\Models\User::class,
        ]);
    }

    /** @test */
    public function guest_cannot_create_order(): void
    {
        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
        ]);

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function order_creation_fails_with_empty_cart(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseCount('orders', 0);
    }

    /** @test */
    public function order_can_have_different_shipping_and_billing_addresses(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $shippingAddress = Address::factory()->create([
            'user_id' => $customer->id,
            'type' => 'shipping',
        ]);
        $billingAddress = Address::factory()->create([
            'user_id' => $customer->id,
            'type' => 'billing',
        ]);

        $product = Product::factory()->create();
        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
        ]);

        $this->post(route('checkout.process'), [
            'payment_method' => 'stripe',
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $billingAddress->id,
        ]);

        $order = $customer->orders()->first();
        $this->assertEquals($shippingAddress->id, $order->shipping_address_id);
        $this->assertEquals($billingAddress->id, $order->billing_address_id);
    }
}
