<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Add price_cents as alias to unit_price_cents for compatibility
            $table->bigInteger('price_cents')->default(0)->after('unit_price_cents');
        });

        // Copy unit_price_cents to price_cents for existing records
        DB::table('order_items')->update([
            'price_cents' => DB::raw('unit_price_cents'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('price_cents');
        });
    }
};
