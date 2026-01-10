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
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shipping_zone_id')->constrained()->onDelete('cascade');
            $table->foreignId('shipping_method_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('min_weight')->default(0)->comment('in grams');
            $table->unsignedInteger('max_weight')->nullable()->comment('in grams');
            $table->unsignedBigInteger('min_order_cents')->default(0);
            $table->unsignedBigInteger('max_order_cents')->nullable();
            $table->unsignedBigInteger('rate_cents')->default(0);
            $table->unsignedBigInteger('free_shipping_threshold_cents')->nullable();
            $table->timestamps();

            $table->index(['shipping_zone_id', 'shipping_method_id']);
            $table->index('min_weight');
            $table->index('min_order_cents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
