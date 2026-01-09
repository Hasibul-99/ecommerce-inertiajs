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
        Schema::table('reviews', function (Blueprint $table) {
            $table->text('pros')->nullable()->after('comment');
            $table->text('cons')->nullable()->after('pros');
            $table->unsignedInteger('reported_count')->default(0)->after('helpful_count');
            $table->text('vendor_response')->nullable()->after('reported_count');
            $table->timestamp('vendor_response_at')->nullable()->after('vendor_response');
            $table->unsignedBigInteger('vendor_response_by')->nullable()->after('vendor_response_at');

            $table->foreign('vendor_response_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['vendor_response_by']);
            $table->dropColumn([
                'pros',
                'cons',
                'reported_count',
                'vendor_response',
                'vendor_response_at',
                'vendor_response_by',
            ]);
        });
    }
};
