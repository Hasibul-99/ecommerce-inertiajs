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
