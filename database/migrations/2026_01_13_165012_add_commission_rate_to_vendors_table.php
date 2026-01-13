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
        Schema::table('vendors', function (Blueprint $table) {
            // Add commission_rate as decimal (percentage, e.g., 15.5 for 15.5%)
            $table->decimal('commission_rate', 5, 2)->default(10.00)->after('business_name');
        });

        // Set default commission rate for existing vendors
        DB::table('vendors')->update([
            'commission_rate' => 10.00,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn('commission_rate');
        });
    }
};
