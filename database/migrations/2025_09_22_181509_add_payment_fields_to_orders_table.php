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
            $table->string('payment_method')->default('cod')->after('payment_id');
            $table->string('payment_status')->default('unpaid')->after('payment_method');
            $table->string('fulfillment_status')->nullable()->after('payment_status');
            $table->string('tracking_number')->nullable()->after('fulfillment_status');
            $table->string('shipping_carrier')->nullable()->after('tracking_number');
            $table->json('metadata')->nullable()->after('shipping_carrier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'fulfillment_status',
                'tracking_number',
                'shipping_carrier',
                'metadata'
            ]);
        });
    }
};
