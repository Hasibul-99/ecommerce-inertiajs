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
        Schema::create('order_refunds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->bigInteger('amount_cents');
            $table->string('reason');
            $table->text('notes')->nullable();
            $table->string('status');
            $table->json('refund_details')->nullable();
            $table->timestamps();
            
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade');
                
            $table->foreign('payment_id')
                ->references('id')
                ->on('payments')
                ->onDelete('set null');
                
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('restrict');
                
            $table->index('order_id');
            $table->index('payment_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_refunds');
    }
};
