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
        Schema::create('price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('old_price_cents');
            $table->unsignedBigInteger('new_price_cents');
            $table->foreignId('changed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('reason')->nullable();
            $table->timestamps();

            // Index for analytics queries
            $table->index(['product_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_histories');
    }
};
