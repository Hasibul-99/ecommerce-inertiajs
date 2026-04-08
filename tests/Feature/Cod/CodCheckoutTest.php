<?php

declare(strict_types=1);

namespace Tests\Feature\Cod;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Product;
use App\Services\CodService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CodCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private CodService $codService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->codService = app(CodService::class);
    }

    /** @test */
    public function customer_can_place_cod_order_with_valid_address(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        // Create address
        $address = Address::factory()->create([
            'user_id' => $customer->id,
            'type' => 'shipping',
        ]);

        // Create products and add to cart
        $product1 = Product::factory()->create(['price' => 10000, 'stock' => 10]); // $100
        $product2 = Product::factory()->create(['price' => 15000, 'stock' => 5]); // $150

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product1->id,
            'quantity' => 2,
        ]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product2->id,
            'quantity' => 1,
        ]);

        // Place COD order
        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Assert order created
        $this->assertDatabaseHas('orders', [
            'user_id' => $customer->id,
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'status' => 'pending',
        ]);

        // Assert order items created
        $this->assertDatabaseCount('order_items', 2);

        // Assert cart cleared
        $this->assertDatabaseCount('carts', 0);
    }

    /** @test */
    public function cod_order_includes_cod_fee(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertRedirect();

        // Assert COD fee was added
        $order = $customer->orders()->first();
        $this->assertNotNull($order);
        $this->assertGreaterThan(0, $order->cod_fee_cents ?? 0);
    }

    /** @test */
    public function cod_order_fails_if_amount_below_minimum(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);

        // Create product with price below minimum
        $product = Product::factory()->create(['price' => 100, 'stock' => 10]); // $1

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseCount('orders', 0);
    }

    /** @test */
    public function cod_order_fails_if_amount_above_maximum(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);

        // Create product with price above maximum
        $product = Product::factory()->create(['price' => 60000000, 'stock' => 10]); // $600,000

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseCount('orders', 0);
    }

    /** @test */
    public function cod_is_available_for_valid_address(): void
    {
        $address = Address::factory()->create([
            'state' => 'CA',
            'city' => 'Los Angeles',
            'postal_code' => '90001',
        ]);

        $isAvailable = $this->codService->isAvailableForAddress($address);

        $this->assertTrue($isAvailable);
    }

    /** @test */
    public function cod_fee_is_calculated_correctly(): void
    {
        // Test with different amounts
        $fee1 = $this->codService->getCodFee(10000); // $100
        $fee2 = $this->codService->getCodFee(50000); // $500
        $fee3 = $this->codService->getCodFee(100000); // $1000

        $this->assertGreaterThan(0, $fee1);
        $this->assertGreaterThan(0, $fee2);
        $this->assertGreaterThan(0, $fee3);

        // Higher amounts should have higher fees
        $this->assertGreaterThanOrEqual($fee1, $fee2);
        $this->assertGreaterThanOrEqual($fee2, $fee3);
    }

    /** @test */
    public function guest_cannot_place_cod_order(): void
    {
        $address = Address::factory()->create();
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function cod_order_requires_phone_verification(): void
    {
        $customer = $this->createCustomer(['phone_verified_at' => null]);
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertSessionHasErrors(['phone']);
    }

    /** @test */
    public function cod_order_decreases_product_stock(): void
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
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        // Assert stock decreased
        $this->assertEquals(7, $product->fresh()->stock);
    }

    /** @test */
    public function cod_order_fails_if_insufficient_stock(): void
    {
        $customer = $this->createCustomer();
        $this->actingAs($customer);

        $address = Address::factory()->create(['user_id' => $customer->id]);
        $product = Product::factory()->create(['price' => 10000, 'stock' => 2]);

        Cart::factory()->create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 5, // More than available
        ]);

        $response = $this->post(route('checkout.process'), [
            'payment_method' => 'cod',
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseCount('orders', 0);
        $this->assertEquals(2, $product->fresh()->stock); // Stock unchanged
    }
}
