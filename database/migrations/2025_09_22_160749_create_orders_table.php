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
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('billing_address_id');
            $table->unsignedBigInteger('shipping_address_id');
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->string('status');
            $table->bigInteger('subtotal_cents');
            $table->bigInteger('tax_cents');
            $table->bigInteger('shipping_cents');
            $table->bigInteger('discount_cents')->default(0);
            $table->bigInteger('total_cents');
            $table->string('coupon_code')->nullable();
            $table->string('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');
                
            $table->foreign('billing_address_id')
                ->references('id')
                ->on('addresses')
                ->onDelete('restrict');
                
            $table->foreign('shipping_address_id')
                ->references('id')
                ->on('addresses')
                ->onDelete('restrict');
                
            $table->foreign('payment_id')
                ->references('id')
                ->on('payments')
                ->onDelete('set null');
                
            $table->index('order_number');
            $table->index('user_id');
            $table->index('status');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
