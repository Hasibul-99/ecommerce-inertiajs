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
        Schema::table('products', function (Blueprint $table) {
            // Check and add columns only if they don't exist
            if (!Schema::hasColumn('products', 'stock_quantity')) {
                $table->integer('stock_quantity')->default(0)->after('base_price_cents');
                $table->index('stock_quantity');
            }

            if (!Schema::hasColumn('products', 'sku')) {
                $table->string('sku')->nullable()->after('slug');
                $table->index('sku');
            }

            if (!Schema::hasColumn('products', 'name')) {
                $table->string('name')->nullable()->after('title');
            }

            if (!Schema::hasColumn('products', 'price_cents')) {
                $table->bigInteger('price_cents')->nullable()->after('base_price_cents');
            }

            if (!Schema::hasColumn('products', 'sale_price_cents')) {
                $table->bigInteger('sale_price_cents')->nullable()->after('price_cents');
            }

            if (!Schema::hasColumn('products', 'compare_at_price_cents')) {
                $table->bigInteger('compare_at_price_cents')->nullable()->after('sale_price_cents');
            }

            if (!Schema::hasColumn('products', 'cost_cents')) {
                $table->bigInteger('cost_cents')->nullable()->after('compare_at_price_cents');
            }

            if (!Schema::hasColumn('products', 'average_rating')) {
                $table->decimal('average_rating', 3, 2)->default(0)->after('stock_quantity');
                $table->index('average_rating');
            }

            if (!Schema::hasColumn('products', 'reviews_count')) {
                $table->integer('reviews_count')->default(0)->after('average_rating');
            }

            if (!Schema::hasColumn('products', 'sales_count')) {
                $table->integer('sales_count')->default(0)->after('reviews_count');
            }

            if (!Schema::hasColumn('products', 'views_count')) {
                $table->integer('views_count')->default(0)->after('sales_count');
                $table->index('views_count');
            }

            if (!Schema::hasColumn('products', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('status');
                $table->index('is_active');
            }

            if (!Schema::hasColumn('products', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_active');
                $table->index('is_featured');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['stock_quantity']);
            $table->dropIndex(['sku']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['average_rating']);
            $table->dropIndex(['views_count']);

            $table->dropColumn([
                'stock_quantity',
                'sku',
                'name',
                'price_cents',
                'sale_price_cents',
                'compare_at_price_cents',
                'cost_cents',
                'average_rating',
                'reviews_count',
                'sales_count',
                'views_count',
                'is_active',
                'is_featured',
            ]);
        });
    }
};
