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
        Schema::table('order_items', function (Blueprint $table) {
            // Vendor fulfillment status tracking
            $table->enum('vendor_status', [
                'pending',
                'confirmed',
                'processing',
                'ready_to_ship',
                'shipped',
                'delivered',
                'cancelled',
                'refunded'
            ])->default('pending')->after('total_cents');

            // Shipping information
            $table->string('carrier')->nullable()->after('vendor_status');
            $table->string('tracking_number')->nullable()->after('carrier');
            $table->timestamp('shipped_at')->nullable()->after('tracking_number');
            $table->timestamp('estimated_delivery_at')->nullable()->after('shipped_at');
            $table->timestamp('delivered_at')->nullable()->after('estimated_delivery_at');

            // Vendor notes
            $table->text('vendor_notes')->nullable()->after('delivered_at');

            // Index for faster queries
            $table->index('vendor_status');
            $table->index('shipped_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['vendor_status']);
            $table->dropIndex(['shipped_at']);

            $table->dropColumn([
                'vendor_status',
                'carrier',
                'tracking_number',
                'shipped_at',
                'estimated_delivery_at',
                'delivered_at',
                'vendor_notes',
            ]);
        });
    }
};
