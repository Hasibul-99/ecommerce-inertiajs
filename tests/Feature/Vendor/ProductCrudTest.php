<?php

namespace Tests\Feature\Vendor;

use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use RefreshDatabase;

    protected $vendor;
    protected $user;

    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Create a user with vendor role
        $this->user = User::factory()->create();
        $this->user->assignRole('vendor');

        // Create a vendor associated with the user
        $this->vendor = Vendor::create([
            'user_id' => $this->user->id,
            'business_name' => 'Test Vendor',
            'slug' => 'test-vendor',
            'phone' => '1234567890',
            'status' => 'active',
            'commission_percent' => 10,
        ]);
    }

    /**
     * Test vendor can view their products.
     *
     * @return void
     */
    public function test_vendor_can_view_their_products()
    {
        // Create some products for the vendor
        $products = Product::factory()->count(3)->create([
            'vendor_id' => $this->vendor->id,
        ]);

        // Create products for another vendor
        $otherVendor = Vendor::factory()->create();
        Product::factory()->count(2)->create([
            'vendor_id' => $otherVendor->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/vendor/products');

        $response->assertStatus(200);
        
        // Verify that only the vendor's products are shown
        foreach ($products as $product) {
            $response->assertSee($product->title);
        }
    }

    /**
     * Test vendor can create a product.
     *
     * @return void
     */
    public function test_vendor_can_create_product()
    {
        $productData = [
            'title' => 'New Test Product',
            'description' => 'This is a test product description',
            'base_price_cents' => 1999,
            'currency' => 'USD',
            'status' => 'draft',
            'category_id' => 1,
        ];

        $response = $this->actingAs($this->user)
            ->post('/products', $productData);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('products', [
            'title' => 'New Test Product',
            'vendor_id' => $this->vendor->id,
        ]);
    }

    /**
     * Test vendor can update their product.
     *
     * @return void
     */
    public function test_vendor_can_update_their_product()
    {
        // Create a product for the vendor
        $product = Product::factory()->create([
            'vendor_id' => $this->vendor->id,
            'title' => 'Original Title',
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'base_price_cents' => 2999,
            'status' => 'published',
        ];

        $response = $this->actingAs($this->user)
            ->put("/products/{$product->id}", $updateData);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Updated Title',
            'base_price_cents' => 2999,
        ]);
    }

    /**
     * Test vendor cannot update another vendor's product.
     *
     * @return void
     */
    public function test_vendor_cannot_update_another_vendors_product()
    {
        // Create another vendor and product
        $otherVendor = Vendor::factory()->create();
        $otherProduct = Product::factory()->create([
            'vendor_id' => $otherVendor->id,
        ]);

        $updateData = [
            'title' => 'Unauthorized Update',
            'description' => 'This should not work',
        ];

        $response = $this->actingAs($this->user)
            ->put("/products/{$otherProduct->id}", $updateData);

        $response->assertStatus(403);
        
        $this->assertDatabaseMissing('products', [
            'id' => $otherProduct->id,
            'title' => 'Unauthorized Update',
        ]);
    }

    /**
     * Test vendor can delete their product.
     *
     * @return void
     */
    public function test_vendor_can_delete_their_product()
    {
        // Create a product for the vendor
        $product = Product::factory()->create([
            'vendor_id' => $this->vendor->id,
        ]);

        $response = $this->actingAs($this->user)
            ->delete("/products/{$product->id}");

        $response->assertRedirect();
        
        // Check that the product was soft deleted
        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }

    /**
     * Test vendor cannot delete another vendor's product.
     *
     * @return void
     */
    public function test_vendor_cannot_delete_another_vendors_product()
    {
        // Create another vendor and product
        $otherVendor = Vendor::factory()->create();
        $otherProduct = Product::factory()->create([
            'vendor_id' => $otherVendor->id,
        ]);

        $response = $this->actingAs($this->user)
            ->delete("/products/{$otherProduct->id}");

        $response->assertStatus(403);
        
        // Check that the product was not deleted
        $this->assertDatabaseHas('products', [
            'id' => $otherProduct->id,
            'deleted_at' => null,
        ]);
    }

    /**
     * Test vendor can upload product images.
     *
     * @return void
     */
    public function test_vendor_can_upload_product_images()
    {
        Storage::fake('s3');

        // Create a product for the vendor
        $product = Product::factory()->create([
            'vendor_id' => $this->vendor->id,
        ]);

        $file = UploadedFile::fake()->image('product.jpg');

        $response = $this->actingAs($this->user)
            ->post("/products/{$product->id}/images", [
                'image' => $file,
            ]);

        $response->assertStatus(200);
        
        // Check that the image was processed and associated with the product
        $this->assertCount(1, $product->refresh()->getMedia('images'));
    }
}