<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add name column (alias for title for search service compatibility)
            $table->string('name')->nullable()->after('title');

            // Add price columns
            $table->bigInteger('price_cents')->default(0)->after('base_price_cents');
            $table->bigInteger('sale_price_cents')->nullable()->after('price_cents');
            $table->bigInteger('compare_at_price_cents')->nullable()->after('sale_price_cents');
            $table->bigInteger('cost_cents')->nullable()->after('compare_at_price_cents');

            // Add inventory columns
            $table->string('sku')->nullable()->unique()->after('slug');
            $table->integer('stock_quantity')->default(0)->after('cost_cents');

            // Add rating and sales columns
            $table->decimal('average_rating', 3, 2)->default(0)->after('stock_quantity');
            $table->unsignedInteger('reviews_count')->default(0)->after('average_rating');
            $table->unsignedInteger('sales_count')->default(0)->after('reviews_count');

            // Add feature flags
            $table->boolean('is_featured')->default(false)->after('is_active');

            // Add attributes JSON column
            $table->json('attributes')->nullable()->after('description');

            // Add indexes for performance
            $table->index('price_cents');
            $table->index('is_featured');
            $table->index('average_rating');
            $table->index('stock_quantity');
        });

        // Copy title to name and base_price_cents to price_cents for existing records
        DB::table('products')->update([
            'name' => DB::raw('title'),
            'price_cents' => DB::raw('base_price_cents'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['price_cents']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['average_rating']);
            $table->dropIndex(['stock_quantity']);

            $table->dropColumn([
                'name',
                'price_cents',
                'sale_price_cents',
                'compare_at_price_cents',
                'cost_cents',
                'sku',
                'stock_quantity',
                'average_rating',
                'reviews_count',
                'sales_count',
                'is_featured',
                'attributes',
            ]);
        });
    }
};
