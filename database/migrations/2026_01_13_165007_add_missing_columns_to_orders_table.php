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
        Schema::table('orders', function (Blueprint $table) {
            // Add vendor_id (nullable since orders can have multiple vendors via order items)
            $table->unsignedBigInteger('vendor_id')->nullable()->after('user_id');

            // Add delivered_at timestamp
            $table->timestamp('delivered_at')->nullable()->after('completed_at');

            // Add index for vendor_id
            $table->index('vendor_id');

            // Add foreign key for vendor_id
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['vendor_id']);
            $table->dropIndex(['vendor_id']);
            $table->dropColumn(['vendor_id', 'delivered_at']);
        });
    }
};
