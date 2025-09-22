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
        Schema::create('refunds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('payment_id');
            $table->string('refund_id');
            $table->bigInteger('amount_cents');
            $table->string('status');
            $table->string('reason');
            $table->json('refund_details')->nullable();
            $table->timestamps();
            
            $table->foreign('payment_id')
                ->references('id')
                ->on('payments')
                ->onDelete('restrict');
                
            $table->index('payment_id');
            $table->index('refund_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
