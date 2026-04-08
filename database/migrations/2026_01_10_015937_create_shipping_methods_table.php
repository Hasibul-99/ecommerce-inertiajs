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
        Schema::create('shipping_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('carrier')->nullable();
            $table->enum('type', ['standard', 'express', 'overnight', 'pickup', 'free'])->default('standard');
            $table->unsignedTinyInteger('estimated_days_min')->default(1);
            $table->unsignedTinyInteger('estimated_days_max')->default(7);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_methods');
    }
};
