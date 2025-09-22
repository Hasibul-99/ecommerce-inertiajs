<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variant_id')->nullable();
            $table->unsignedBigInteger('vendor_id');
            $table->string('product_name');
            $table->string('variant_name')->nullable();
            $table->integer('quantity');
            $table->bigInteger('unit_price_cents');
            $table->bigInteger('subtotal_cents');
            $table->bigInteger('tax_cents');
            $table->bigInteger('total_cents');
            $table->json('product_snapshot')->nullable();
            $table->timestamps();
            
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade');
                
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('restrict');
                
            $table->foreign('product_variant_id')
                ->references('id')
                ->on('product_variants')
                ->onDelete('set null');
                
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('restrict');
                
            $table->index('order_id');
            $table->index('product_id');
            $table->index('vendor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
