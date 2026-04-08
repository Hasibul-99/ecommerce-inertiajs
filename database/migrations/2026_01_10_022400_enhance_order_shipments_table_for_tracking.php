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
        Schema::table('order_shipments', function (Blueprint $table) {
            // Label information
            $table->string('label_url')->nullable()->after('tracking_number');
            $table->timestamp('label_created_at')->nullable()->after('label_url');

            // Package details
            $table->unsignedInteger('weight')->nullable()->after('shipping_method')->comment('in grams');
            $table->json('dimensions')->nullable()->after('weight')->comment('length, width, height in cm');

            // Costs
            $table->unsignedBigInteger('shipping_cost_cents')->nullable()->after('dimensions');
            $table->unsignedBigInteger('insurance_cents')->nullable()->after('shipping_cost_cents');

            // Pickup information
            $table->timestamp('pickup_scheduled_at')->nullable()->after('shipped_at');
            $table->timestamp('picked_up_at')->nullable()->after('pickup_scheduled_at');

            // Tracking updates
            $table->timestamp('last_tracking_update')->nullable()->after('delivered_at');
            $table->json('tracking_events')->nullable()->after('last_tracking_update');

            // Indexes for performance (skip existing indexes)
            $table->index('last_tracking_update');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_shipments', function (Blueprint $table) {
            $table->dropIndex(['last_tracking_update']);

            $table->dropColumn([
                'label_url',
                'label_created_at',
                'weight',
                'dimensions',
                'shipping_cost_cents',
                'insurance_cents',
                'pickup_scheduled_at',
                'picked_up_at',
                'last_tracking_update',
                'tracking_events',
            ]);
        });
    }
};
