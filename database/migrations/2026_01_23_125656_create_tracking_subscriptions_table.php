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
        Schema::create('tracking_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->boolean('email_enabled')->default(true);
            $table->boolean('sms_enabled')->default(false);
            $table->string('unsubscribe_token', 64)->unique();
            $table->timestamps();

            $table->index(['order_id', 'email']);
            $table->index('unsubscribe_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_subscriptions');
    }
};
