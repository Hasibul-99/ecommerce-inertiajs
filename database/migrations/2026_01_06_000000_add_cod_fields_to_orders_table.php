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
            // COD-specific fields
            $table->boolean('cod_verification_required')->default(true)->after('payment_status');
            $table->bigInteger('cod_amount_collected')->nullable()->after('cod_verification_required');
            $table->timestamp('cod_collected_at')->nullable()->after('cod_amount_collected');
            $table->unsignedBigInteger('cod_collected_by')->nullable()->after('cod_collected_at');
            $table->unsignedBigInteger('delivery_person_id')->nullable()->after('cod_collected_by');
            $table->bigInteger('cod_fee_cents')->default(0)->after('delivery_person_id');

            // Foreign keys
            $table->foreign('cod_collected_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('delivery_person_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            // Indexes for performance
            $table->index('cod_verification_required');
            $table->index('cod_collected_at');
            $table->index('delivery_person_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['cod_collected_by']);
            $table->dropForeign(['delivery_person_id']);

            // Drop columns
            $table->dropColumn([
                'cod_verification_required',
                'cod_amount_collected',
                'cod_collected_at',
                'cod_collected_by',
                'delivery_person_id',
                'cod_fee_cents',
            ]);
        });
    }
};
