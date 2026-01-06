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
        Schema::create('cod_reconciliations', function (Blueprint $table) {
            $table->id();
            $table->date('date')->index();
            $table->unsignedBigInteger('delivery_person_id')->nullable();

            // Collection summary
            $table->integer('total_orders_count')->default(0);
            $table->bigInteger('total_cod_amount_cents')->default(0);
            $table->bigInteger('collected_amount_cents')->default(0);
            $table->bigInteger('discrepancy_cents')->default(0);

            // Status tracking
            $table->string('status')->default('pending')->index(); // pending, verified, disputed, resolved

            // Verification
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();

            // Additional information
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('delivery_person_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('verified_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            // Indexes for performance
            $table->index(['date', 'delivery_person_id']);
            $table->index(['date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cod_reconciliations');
    }
};
