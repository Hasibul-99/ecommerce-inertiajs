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
        Schema::table('payouts', function (Blueprint $table) {
            // Add period tracking fields
            $table->timestamp('period_start')->nullable()->after('vendor_id');
            $table->timestamp('period_end')->nullable()->after('period_start');
            
            // Add items count
            $table->integer('items_count')->default(0)->after('period_end');
            
            // Add payout method (separate from payment_method for clarity)
            $table->string('payout_method')->nullable()->after('payment_method');
            
            // Add fee and net amount tracking
            $table->bigInteger('processing_fee_cents')->default(0)->after('amount_cents');
            $table->bigInteger('net_amount_cents')->default(0)->after('processing_fee_cents');
            
            // Add cancellation tracking
            $table->string('cancellation_reason')->nullable()->after('processed_at');
            $table->timestamp('cancelled_at')->nullable()->after('cancellation_reason');
            
            // Add requester tracking
            $table->unsignedBigInteger('requested_by')->nullable()->after('cancelled_at');
            $table->unsignedBigInteger('processed_by')->nullable()->after('requested_by');
            
            // Add foreign keys
            $table->foreign('requested_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
                
            $table->foreign('processed_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payouts', function (Blueprint $table) {
            $table->dropForeign(['requested_by']);
            $table->dropForeign(['processed_by']);
            
            $table->dropColumn([
                'period_start',
                'period_end',
                'items_count',
                'payout_method',
                'processing_fee_cents',
                'net_amount_cents',
                'cancellation_reason',
                'cancelled_at',
                'requested_by',
                'processed_by',
            ]);
        });
    }
};
