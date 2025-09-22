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
        Schema::create('payouts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('vendor_id');
            $table->string('payout_id')->nullable();
            $table->bigInteger('amount_cents');
            $table->string('status');
            $table->string('payment_method');
            $table->json('payout_details')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('restrict');
                
            $table->index('vendor_id');
            $table->index('status');
            $table->index('payout_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
