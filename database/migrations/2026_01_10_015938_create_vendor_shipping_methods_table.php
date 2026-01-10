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
        Schema::create('vendor_shipping_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->foreignId('shipping_method_id')->constrained()->onDelete('cascade');
            $table->boolean('is_enabled')->default(true);
            $table->unsignedBigInteger('custom_rate_cents')->nullable();
            $table->unsignedTinyInteger('handling_time_days')->default(2);
            $table->timestamps();

            $table->unique(['vendor_id', 'shipping_method_id']);
            $table->index('is_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_shipping_methods');
    }
};
