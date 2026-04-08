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
