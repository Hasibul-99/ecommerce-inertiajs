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
        Schema::create('commissions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_item_id');
            $table->unsignedBigInteger('vendor_id');
            $table->decimal('rate', 5, 2);
            $table->bigInteger('amount_cents');
            $table->string('status')->default('pending');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            
            $table->foreign('order_item_id')
                ->references('id')
                ->on('order_items')
                ->onDelete('restrict');
                
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('restrict');
                
            $table->index('vendor_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
