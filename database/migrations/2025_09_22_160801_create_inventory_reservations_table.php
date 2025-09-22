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
        Schema::create('inventory_reservations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('product_variant_id');
            $table->unsignedBigInteger('cart_item_id')->nullable();
            $table->unsignedBigInteger('order_item_id')->nullable();
            $table->integer('quantity');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->foreign('product_variant_id')
                ->references('id')
                ->on('product_variants')
                ->onDelete('cascade');
                
            $table->foreign('cart_item_id')
                ->references('id')
                ->on('cart_items')
                ->onDelete('cascade');
                
            $table->foreign('order_item_id')
                ->references('id')
                ->on('order_items')
                ->onDelete('cascade');
                
            $table->index('product_variant_id');
            $table->index('cart_item_id');
            $table->index('order_item_id');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_reservations');
    }
};
