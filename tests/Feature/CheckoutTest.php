<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Address;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use App\Events\OrderPlaced;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;
    
    protected $user;
    protected $product;
    protected $variant;
    protected $cart;
    
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
        
        // Create a cart for the user
        $this->cart = Cart::create([
            'user_id' => $this->user->id,
            'subtotal_cents' => 2000,
            'tax_cents' => 200,
            'total_cents' => 2200,
        ]);
        
        // Add an item to the cart
        CartItem::create([
            'cart_id' => $this->cart->id,
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant->id,
            'quantity' => 2,
            'price_cents' => 1000,
        ]);
        
        // Create a shipping address for the user
        Address::create([
            'user_id' => $this->user->id,
            'type' => 'shipping',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'address_line1' => '123 Main St',
            'city' => 'Anytown',
            'state' => 'CA',
            'postal_code' => '12345',
            'country' => 'US',
            'phone' => '555-123-4567',
            'is_default' => true,
        ]);
        
        // Create a billing address for the user
        Address::create([
            'user_id' => $this->user->id,
            'type' => 'billing',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'address_line1' => '123 Main St',
            'city' => 'Anytown',
            'state' => 'CA',
            'postal_code' => '12345',
            'country' => 'US',
            'phone' => '555-123-4567',
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
     * Test viewing the checkout page.
     *
     * @return void
     */
    public function test_user_can_view_checkout_page()
    {
        $this->actingAs($this->user);
        
        $response = $this->get('/checkout');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert->component('Checkout'));
    }
    
    /**
     * Test that guest users are redirected to login when trying to checkout.
     *
     * @return void
     */
    public function test_guest_users_redirected_to_login_at_checkout()
    {
        $response = $this->get('/checkout');
        
        $response->assertRedirect('/login');
    }
    
    /**
     * Test that checkout fails if cart is empty.
     *
     * @return void
     */
    public function test_checkout_fails_if_cart_empty()
    {
        $this->actingAs($this->user);
        
        // Empty the cart
        $this->cart->items()->delete();
        
        $response = $this->post('/checkout/process', [
            'shipping_address_id' => 1,
            'billing_address_id' => 2,
            'payment_method' => 'credit_card',
            'credit_card_number' => '4242424242424242',
            'credit_card_expiry' => '12/25',
            'credit_card_cvv' => '123',
        ]);
        
        $response->assertStatus(302); // Redirect
        $response->assertSessionHasErrors(); // Should have errors
    }
    
    /**
     * Test successful checkout process with credit card.
     *
     * @return void
     */
    public function test_successful_checkout_with_credit_card()
    {
        $this->actingAs($this->user);
        
        // Mock the OrderPlaced event
        Event::fake([OrderPlaced::class]);
        
        $shippingAddress = Address::where('user_id', $this->user->id)
            ->where('type', 'shipping')
            ->first();
            
        $billingAddress = Address::where('user_id', $this->user->id)
            ->where('type', 'billing')
            ->first();
        
        $response = $this->post('/checkout/process', [
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $billingAddress->id,
            'payment_method' => 'credit_card',
            'credit_card_number' => '4242424242424242',
            'credit_card_expiry' => '12/25',
            'credit_card_cvv' => '123',
            'reservation_id' => 'test_reservation',
        ]);
        
        // Check if order was created
        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'total_cents' => 2200,
            'status' => 'processing', // Order should be processing after payment
        ]);
        
        // Check if cart was cleared
        $this->assertEquals(0, $this->cart->fresh()->items()->count());
        
        // Check if inventory was updated
        $this->assertEquals(8, $this->variant->fresh()->stock_quantity); // 10 - 2
        
        // Check if OrderPlaced event was dispatched
        Event::assertDispatched(OrderPlaced::class);
        
        // Check if payment was recorded
        $order = Order::where('user_id', $this->user->id)->latest()->first();
        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'amount_cents' => 2200,
            'payment_method' => 'credit_card',
            'status' => 'completed',
        ]);
        
        // Should redirect to order confirmation
        $response->assertRedirect(route('orders.show', $order));
    }
    
    /**
     * Test checkout with insufficient stock.
     *
     * @return void
     */
    public function test_checkout_fails_with_insufficient_stock()
    {
        $this->actingAs($this->user);
        
        // Update variant to have insufficient stock
        $this->variant->update(['stock_quantity' => 1]); // Less than cart quantity (2)
        
        $shippingAddress = Address::where('user_id', $this->user->id)
            ->where('type', 'shipping')
            ->first();
            
        $billingAddress = Address::where('user_id', $this->user->id)
            ->where('type', 'billing')
            ->first();
        
        $response = $this->post('/checkout/process', [
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $billingAddress->id,
            'payment_method' => 'credit_card',
            'credit_card_number' => '4242424242424242',
            'credit_card_expiry' => '12/25',
            'credit_card_cvv' => '123',
            'reservation_id' => 'test_reservation',
        ]);
        
        // Should redirect back with errors
        $response->assertStatus(302);
        $response->assertSessionHasErrors();
        
        // No order should be created
        $this->assertEquals(0, Order::count());
    }
    
    /**
     * Test checkout validation for required fields.
     *
     * @return void
     */
    public function test_checkout_validates_required_fields()
    {
        $this->actingAs($this->user);
        
        // Missing required fields
        $response = $this->post('/checkout/process', [
            // Missing shipping_address_id
            'billing_address_id' => 2,
            'payment_method' => 'credit_card',
            // Missing credit card details
        ]);
        
        $response->assertStatus(302); // Redirect back
        $response->assertSessionHasErrors(['shipping_address_id', 'credit_card_number']); // Should have validation errors
    }
    
    /**
     * Test checkout with different payment methods.
     *
     * @return void
     */
    public function test_checkout_with_bank_transfer()
    {
        $this->actingAs($this->user);
        
        $shippingAddress = Address::where('user_id', $this->user->id)
            ->where('type', 'shipping')
            ->first();
            
        $billingAddress = Address::where('user_id', $this->user->id)
            ->where('type', 'billing')
            ->first();
        
        $response = $this->post('/checkout/process', [
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $billingAddress->id,
            'payment_method' => 'bank_transfer',
            'bank_name' => 'Test Bank',
            'bank_account_name' => 'John Doe',
            'bank_account_number' => '123456789',
            'reservation_id' => 'test_reservation',
        ]);
        
        // Check if order was created
        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'payment_method' => 'bank_transfer',
        ]);
        
        // Order should be created and redirect to confirmation
        $order = Order::where('user_id', $this->user->id)->latest()->first();
        $response->assertRedirect(route('orders.show', $order));
    }
}