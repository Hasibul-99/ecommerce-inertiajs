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
        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('wishlist_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variant_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->foreign('wishlist_id')
                ->references('id')
                ->on('wishlists')
                ->onDelete('cascade');
                
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
                
            $table->foreign('product_variant_id')
                ->references('id')
                ->on('product_variants')
                ->onDelete('set null');
                
            $table->index('wishlist_id');
            $table->index('product_id');
            
            $table->unique(['wishlist_id', 'product_id', 'product_variant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlist_items');
    }
};
