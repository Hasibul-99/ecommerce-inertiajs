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
        // Security events log
        Schema::create('security_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip', 45); // IPv6 support
            $table->string('type'); // login_failed, suspicious_activity, xss_attempt, etc.
            $table->text('description')->nullable();
            $table->json('data')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('type');
            $table->index('ip');
            $table->index('created_at');
        });

        // Blocked IPs
        Schema::create('blocked_ips', function (Blueprint $table) {
            $table->id();
            $table->string('ip', 45)->unique();
            $table->string('reason');
            $table->timestamp('blocked_until')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('ip');
            $table->index('blocked_until');
        });

        // Login attempts tracking
        Schema::create('login_attempts', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('ip', 45);
            $table->boolean('successful')->default(false);
            $table->string('user_agent')->nullable();
            $table->json('metadata')->nullable(); // Browser, OS, device info
            $table->timestamps();

            $table->index(['email', 'created_at']);
            $table->index(['ip', 'created_at']);
            $table->index('successful');
            $table->index('created_at');
        });

        // Account locks (temporary lockouts after failed attempts)
        Schema::create('account_locks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->timestamp('locked_until');
            $table->integer('failed_attempts')->default(0);
            $table->timestamps();

            $table->index('user_id');
            $table->index('locked_until');
        });

        // Trusted devices for login verification
        Schema::create('trusted_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('device_hash')->unique();
            $table->string('device_name')->nullable();
            $table->string('ip', 45);
            $table->string('user_agent');
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('device_hash');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trusted_devices');
        Schema::dropIfExists('account_locks');
        Schema::dropIfExists('login_attempts');
        Schema::dropIfExists('blocked_ips');
        Schema::dropIfExists('security_events');
    }
};
