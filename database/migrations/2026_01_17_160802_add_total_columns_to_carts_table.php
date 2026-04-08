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
        Schema::table('carts', function (Blueprint $table) {
            $table->unsignedInteger('subtotal_cents')->default(0)->after('session_id');
            $table->unsignedInteger('tax_cents')->default(0)->after('subtotal_cents');
            $table->unsignedInteger('total_cents')->default(0)->after('tax_cents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn(['subtotal_cents', 'tax_cents', 'total_cents']);
        });
    }
};
