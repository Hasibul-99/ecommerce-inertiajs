<?php

declare(strict_types=1);

namespace Tests\Feature\Vendor;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\VendorTestCase;

class VendorProductTest extends VendorTestCase
{
    use RefreshDatabase;

    /** @test */
    public function vendor_can_view_their_products(): void
    {
        $this->createVendorProducts(5);

        $response = $this->get(route('vendor.products.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Vendor/Products/Index')
            ->has('products.data', 5)
        );
    }

    /** @test */
    public function vendor_can_create_new_product(): void
    {
        Storage::fake('public');

        $category = Category::factory()->create();

        $response = $this->post(route('vendor.products.store'), [
            'title' => 'Test Product',
            'description' => 'Test description',
            'price' => 99.99,
            'stock' => 10,
            'category_id' => $category->id,
            'sku' => 'TEST-SKU-001',
            'images' => [
                UploadedFile::fake()->image('product1.jpg'),
                UploadedFile::fake()->image('product2.jpg'),
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('products', [
            'vendor_id' => $this->vendorProfile->id,
            'title' => 'Test Product',
            'price' => 9999, // Stored in cents
            'stock' => 10,
            'category_id' => $category->id,
        ]);
    }

    /** @test */
    public function vendor_can_update_their_product(): void
    {
        $product = $this->createVendorProduct([
            'title' => 'Old Title',
            'price' => 5000,
        ]);

        $response = $this->put(route('vendor.products.update', $product), [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'price' => 149.99,
            'stock' => 20,
            'category_id' => $product->category_id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Updated Title',
            'price' => 14999,
            'stock' => 20,
        ]);
    }

    /** @test */
    public function vendor_can_delete_their_product(): void
    {
        $product = $this->createVendorProduct();

        $response = $this->delete(route('vendor.products.destroy', $product));

        $response->assertRedirect();

        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }

    /** @test */
    public function vendor_cannot_view_other_vendors_products(): void
    {
        $otherVendor = $this->createVendor();
        $otherProduct = Product::factory()->create([
            'vendor_id' => $otherVendor->vendor->id,
        ]);

        $response = $this->get(route('vendor.products.edit', $otherProduct));

        $response->assertForbidden();
    }

    /** @test */
    public function vendor_cannot_update_other_vendors_products(): void
    {
        $otherVendor = $this->createVendor();
        $otherProduct = Product::factory()->create([
            'vendor_id' => $otherVendor->vendor->id,
        ]);

        $response = $this->put(route('vendor.products.update', $otherProduct), [
            'title' => 'Hacked Title',
        ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('products', [
            'id' => $otherProduct->id,
            'title' => 'Hacked Title',
        ]);
    }

    /** @test */
    public function vendor_can_update_product_stock(): void
    {
        $product = $this->createVendorProduct(['stock' => 10]);

        $response = $this->patch(route('vendor.products.update-stock', $product), [
            'stock' => 25,
        ]);

        $response->assertOk();

        $this->assertEquals(25, $product->fresh()->stock);
    }

    /** @test */
    public function vendor_can_bulk_update_product_status(): void
    {
        $products = $this->createVendorProducts(3, ['status' => 'active']);

        $response = $this->post(route('vendor.products.bulk-update'), [
            'product_ids' => $products->pluck('id')->toArray(),
            'status' => 'inactive',
        ]);

        $response->assertOk();

        foreach ($products as $product) {
            $this->assertEquals('inactive', $product->fresh()->status);
        }
    }

    /** @test */
    public function product_requires_all_mandatory_fields(): void
    {
        $response = $this->post(route('vendor.products.store'), []);

        $response->assertSessionHasErrors([
            'title',
            'description',
            'price',
            'stock',
            'category_id',
        ]);
    }

    /** @test */
    public function product_price_must_be_positive(): void
    {
        $category = Category::factory()->create();

        $response = $this->post(route('vendor.products.store'), [
            'title' => 'Test Product',
            'description' => 'Test description',
            'price' => -10,
            'stock' => 10,
            'category_id' => $category->id,
        ]);

        $response->assertSessionHasErrors(['price']);
    }

    /** @test */
    public function product_stock_cannot_be_negative(): void
    {
        $product = $this->createVendorProduct();

        $response = $this->patch(route('vendor.products.update-stock', $product), [
            'stock' => -5,
        ]);

        $response->assertSessionHasErrors(['stock']);
    }

    /** @test */
    public function vendor_can_add_product_variants(): void
    {
        $product = $this->createVendorProduct();

        $response = $this->post(route('vendor.products.variants.store', $product), [
            'variants' => [
                [
                    'name' => 'Size: Small, Color: Red',
                    'sku' => 'PROD-SM-RED',
                    'price' => 89.99,
                    'stock' => 5,
                ],
                [
                    'name' => 'Size: Large, Color: Blue',
                    'sku' => 'PROD-LG-BLUE',
                    'price' => 99.99,
                    'stock' => 10,
                ],
            ],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseCount('product_variants', 2);
        $this->assertDatabaseHas('product_variants', [
            'product_id' => $product->id,
            'name' => 'Size: Small, Color: Red',
        ]);
    }

    /** @test */
    public function vendor_can_duplicate_product(): void
    {
        $product = $this->createVendorProduct([
            'title' => 'Original Product',
            'price' => 5000,
        ]);

        $response = $this->post(route('vendor.products.duplicate', $product));

        $response->assertRedirect();

        $this->assertDatabaseHas('products', [
            'vendor_id' => $this->vendorProfile->id,
            'title' => 'Original Product (Copy)',
            'price' => 5000,
        ]);
    }

    /** @test */
    public function vendor_can_search_their_products(): void
    {
        $this->createVendorProduct(['title' => 'Blue Widget']);
        $this->createVendorProduct(['title' => 'Red Widget']);
        $this->createVendorProduct(['title' => 'Green Gadget']);

        $response = $this->get(route('vendor.products.index', ['search' => 'Widget']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('products.data', 2));
    }

    /** @test */
    public function vendor_can_filter_products_by_status(): void
    {
        $this->createVendorProducts(3, ['status' => 'active']);
        $this->createVendorProducts(2, ['status' => 'inactive']);

        $response = $this->get(route('vendor.products.index', ['status' => 'active']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('products.data', 3));
    }

    /** @test */
    public function vendor_can_filter_products_by_category(): void
    {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();

        $this->createVendorProducts(3, ['category_id' => $category1->id]);
        $this->createVendorProducts(2, ['category_id' => $category2->id]);

        $response = $this->get(route('vendor.products.index', ['category_id' => $category1->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('products.data', 3));
    }

    /** @test */
    public function product_slug_is_auto_generated_from_title(): void
    {
        $response = $this->post(route('vendor.products.store'), [
            'title' => 'My Awesome Product',
            'description' => 'Description',
            'price' => 99.99,
            'stock' => 10,
            'category_id' => Category::factory()->create()->id,
        ]);

        $this->assertDatabaseHas('products', [
            'title' => 'My Awesome Product',
            'slug' => 'my-awesome-product',
        ]);
    }

    /** @test */
    public function vendor_can_view_product_analytics(): void
    {
        $product = $this->createVendorProduct();

        $response = $this->get(route('vendor.products.analytics', $product));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Vendor/Products/Analytics')
            ->has('views')
            ->has('sales')
            ->has('revenue')
        );
    }
}
