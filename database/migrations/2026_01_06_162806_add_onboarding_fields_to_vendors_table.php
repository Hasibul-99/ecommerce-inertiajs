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
        Schema::table('vendors', function (Blueprint $table) {
            $table->text('description')->nullable()->after('business_name');

            // Address fields
            $table->string('address_line1')->nullable()->after('phone');
            $table->string('address_line2')->nullable()->after('address_line1');
            $table->string('city')->nullable()->after('address_line2');
            $table->string('state')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('state');
            $table->string('country')->nullable()->after('postal_code');

            // Business information
            $table->string('tax_id')->nullable()->after('country');
            $table->string('business_type')->nullable()->after('tax_id');
            $table->string('website')->nullable()->after('business_type');

            // Bank/Payout information
            $table->string('bank_name')->nullable()->after('stripe_account_id');
            $table->string('bank_account_name')->nullable()->after('bank_name');
            $table->string('bank_account_number')->encrypted()->nullable()->after('bank_account_name');
            $table->string('bank_routing_number')->encrypted()->nullable()->after('bank_account_number');
            $table->string('bank_swift_code')->nullable()->after('bank_routing_number');

            // Onboarding tracking
            $table->enum('onboarding_step', ['business_info', 'documents', 'bank_details', 'completed'])->default('business_info')->after('status');
            $table->timestamp('approved_at')->nullable()->after('onboarding_step');
            $table->unsignedBigInteger('approved_by')->nullable()->after('approved_at');
            $table->timestamp('rejected_at')->nullable()->after('approved_by');
            $table->unsignedBigInteger('rejected_by')->nullable()->after('rejected_at');
            $table->text('rejection_reason')->nullable()->after('rejected_by');

            // Add foreign keys
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('rejected_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['rejected_by']);

            $table->dropColumn([
                'description',
                'address_line1',
                'address_line2',
                'city',
                'state',
                'postal_code',
                'country',
                'tax_id',
                'business_type',
                'website',
                'bank_name',
                'bank_account_name',
                'bank_account_number',
                'bank_routing_number',
                'bank_swift_code',
                'onboarding_step',
                'approved_at',
                'approved_by',
                'rejected_at',
                'rejected_by',
                'rejection_reason',
            ]);
        });
    }
};
