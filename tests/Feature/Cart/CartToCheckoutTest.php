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
