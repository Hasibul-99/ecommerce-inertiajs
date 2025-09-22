<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;
    
    protected $user;
    protected $product;
    protected $variant;
    
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Disable foreign key checks for testing
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Create a test user
        $this->user = User::factory()->create();
        
        // Create a test product
        $this->product = Product::create([
            'title' => 'Test Product',
            'slug' => 'test-product',
            'description' => 'Test product description',
            'base_price_cents' => 1000,
            'status' => 'published',
            'published_at' => now(),
            'vendor_id' => 1,
            'currency' => 'USD',
        ]);
        
        // Create a test product variant
        $this->variant = ProductVariant::create([
            'product_id' => $this->product->id,
            'sku' => 'TEST-SKU-1',
            'price_cents' => 1000,
            'stock_quantity' => 10,
            'is_default' => true,
        ]);
    }
    
    /**
     * Clean up the testing environment before the next test.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        parent::tearDown();
    }
    
    /**
     * Test viewing the cart page.
     *
     * @return void
     */
    public function test_user_can_view_cart()
    {
        $this->actingAs($this->user);
        
        $response = $this->get('/cart');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert->component('Cart'));
    }
    
    /**
     * Test adding an item to the cart.
     *
     * @return void
     */
    public function test_user_can_add_item_to_cart()
    {
        $this->actingAs($this->user);
        
        $response = $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 2,
        ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Item added to cart.',
        ]);
        
        // Check that the cart item was created
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant->id,
            'quantity' => 2,
        ]);
        
        // Check that the cart totals were updated
        $cart = Cart::where('user_id', $this->user->id)->first();
        $this->assertEquals(2000, $cart->subtotal_cents); // 2 * 1000
        $this->assertEquals(200, $cart->tax_cents); // 10% of 2000
        $this->assertEquals(2200, $cart->total_cents); // 2000 + 200
    }
    
    /**
     * Test adding an item to the cart when stock is insufficient.
     *
     * @return void
     */
    public function test_cannot_add_item_to_cart_when_stock_insufficient()
    {
        $this->actingAs($this->user);
        
        // Update variant to have limited stock
        $this->variant->update(['stock_quantity' => 1]);
        
        $response = $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 2, // More than available stock
        ]);
        
        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Not enough stock available.',
        ]);
    }
    
    /**
     * Test updating a cart item quantity.
     *
     * @return void
     */
    public function test_user_can_update_cart_item_quantity()
    {
        $this->actingAs($this->user);
        
        // First add an item to the cart
        $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 1,
        ]);
        
        $cart = Cart::where('user_id', $this->user->id)->first();
        $cartItem = $cart->items()->first();
        
        // Update the quantity
        $response = $this->putJson("/cart/items/{$cartItem->id}", [
            'quantity' => 3,
        ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Cart updated.',
        ]);
        
        // Check that the cart item was updated
        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 3,
        ]);
        
        // Check that the cart totals were updated
        $cart->refresh();
        $this->assertEquals(3000, $cart->subtotal_cents); // 3 * 1000
        $this->assertEquals(300, $cart->tax_cents); // 10% of 3000
        $this->assertEquals(3300, $cart->total_cents); // 3000 + 300
    }
    
    /**
     * Test removing an item from the cart.
     *
     * @return void
     */
    public function test_user_can_remove_item_from_cart()
    {
        $this->actingAs($this->user);
        
        // First add an item to the cart
        $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 1,
        ]);
        
        $cart = Cart::where('user_id', $this->user->id)->first();
        $cartItem = $cart->items()->first();
        
        // Remove the item
        $response = $this->deleteJson("/cart/items/{$cartItem->id}");
        
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Item removed from cart.',
        ]);
        
        // Check that the cart item was deleted
        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
        
        // Check that the cart totals were updated
        $cart->refresh();
        $this->assertEquals(0, $cart->subtotal_cents);
        $this->assertEquals(0, $cart->tax_cents);
        $this->assertEquals(0, $cart->total_cents);
    }
    
    /**
     * Test clearing the cart.
     *
     * @return void
     */
    public function test_user_can_clear_cart()
    {
        $this->actingAs($this->user);
        
        // First add multiple items to the cart
        $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 2,
        ]);
        
        // Create another product and variant
        $product2 = Product::create([
            'title' => 'Test Product 2',
            'slug' => 'test-product-2',
            'description' => 'Test product description',
            'base_price_cents' => 2000,
            'status' => 'published',
            'published_at' => now(),
            'vendor_id' => 1,
            'currency' => 'USD',
        ]);
        
        $variant2 = ProductVariant::create([
            'product_id' => $product2->id,
            'sku' => 'TEST-SKU-2',
            'price_cents' => 2000,
            'stock_quantity' => 10,
            'is_default' => true,
        ]);
        
        $this->postJson('/cart/add', [
            'product_id' => $product2->id,
            'variant_id' => $variant2->id,
            'quantity' => 1,
        ]);
        
        $cart = Cart::where('user_id', $this->user->id)->first();
        $this->assertEquals(2, $cart->items()->count());
        
        // Clear the cart
        $response = $this->post('/cart/clear');
        
        $response->assertRedirect();
        $response->assertSessionHas('success', 'Cart cleared.');
        
        // Check that all cart items were deleted
        $this->assertEquals(0, $cart->items()->count());
    }
    
    /**
     * Test guest user can add items to cart with session tracking.
     *
     * @return void
     */
    public function test_guest_user_can_add_items_to_cart()
    {
        // Generate a random session ID
        $sessionId = Str::uuid()->toString();
        
        $response = $this->withHeaders([
            'X-Cart-Token' => $sessionId,
        ])->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 1,
        ]);
        
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Item added to cart.',
        ]);
        
        // Check that the cart was created with the session ID
        $this->assertDatabaseHas('carts', [
            'session_id' => $sessionId,
        ]);
        
        // Check that the cart item was created
        $cart = Cart::where('session_id', $sessionId)->first();
        $this->assertNotNull($cart);
        $this->assertEquals(1, $cart->items()->count());
    }
    
    /**
     * Test that adding the same product variant to the cart updates quantity.
     *
     * @return void
     */
    public function test_adding_same_product_updates_quantity()
    {
        $this->actingAs($this->user);
        
        // Add an item to the cart
        $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 1,
        ]);
        
        // Add the same item again
        $response = $this->postJson('/cart/add', [
            'product_id' => $this->product->id,
            'variant_id' => $this->variant->id,
            'quantity' => 2,
        ]);
        
        $response->assertStatus(200);
        
        // Check that the cart item quantity was updated instead of creating a new item
        $cart = Cart::where('user_id', $this->user->id)->first();
        $this->assertEquals(1, $cart->items()->count());
        $this->assertEquals(3, $cart->items()->first()->quantity); // 1 + 2
    }
}