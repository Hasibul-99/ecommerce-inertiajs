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
        Schema::create('vendors', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->string('business_name');
            $table->string('slug')->unique();
            $table->string('phone');
            $table->enum('status', ['pending', 'approved', 'rejected', 'blocked'])->default('pending');
            $table->decimal('commission_percent', 5, 2)->default(10.00);
            $table->string('stripe_account_id')->nullable();
            $table->json('kyc')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
