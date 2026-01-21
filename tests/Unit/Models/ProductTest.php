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
