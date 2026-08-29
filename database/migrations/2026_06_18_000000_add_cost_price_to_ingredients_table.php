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
        Schema::table('ingredients', function (Blueprint $table) {
            // Purchase cost in euros per base unit (the ingredient's `unit`),
            // so recipe cost = sum(pivot.amount * cost_price) without conversion.
            // Decimal (not integer cents) to match the decimal stock and the
            // euro-based OrderItem.price_at_sale; 4 places cover sub-cent rates
            // such as basil priced per gram.
            $table->decimal('cost_price', 12, 4)->default(0)->after('alert_threshold');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropColumn('cost_price');
        });
    }
};
