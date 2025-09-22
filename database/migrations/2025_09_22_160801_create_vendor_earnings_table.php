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
        Schema::create('vendor_earnings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('vendor_id');
            $table->unsignedBigInteger('order_id');
            $table->bigInteger('amount_cents');
            $table->bigInteger('commission_cents');
            $table->bigInteger('net_amount_cents');
            $table->string('status')->default('pending');
            $table->timestamp('available_at')->nullable();
            $table->timestamps();
            
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('restrict');
                
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('restrict');
                
            $table->index('vendor_id');
            $table->index('status');
            $table->index('available_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_earnings');
    }
};
