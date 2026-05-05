<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')->where('currency', 'USD')->update(['currency' => 'BDT']);
    }

    public function down(): void
    {
        DB::table('products')->where('currency', 'BDT')->update(['currency' => 'USD']);
    }
};
