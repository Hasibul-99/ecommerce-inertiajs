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
        Schema::create('order_shipments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('vendor_id');
            $table->string('tracking_number')->nullable();
            $table->string('shipping_carrier')->nullable();
            $table->string('shipping_method');
            $table->string('status');
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade');
                
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('restrict');
                
            $table->index('order_id');
            $table->index('vendor_id');
            $table->index('tracking_number');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_shipments');
    }
};
