<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Scope core domain tables to their owner (one account = one restaurant).
     *
     * The column is nullable so existing rows keep working; ownership is set
     * on create by the BelongsToTenant trait. No DB-level foreign key is added
     * because SQLite (used in tests) cannot add one via ALTER TABLE — the
     * relation is enforced at the Eloquent level instead.
     */
    public function up(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->index();
            // Ingredient names are unique per account, not globally.
            $table->dropUnique('ingredients_name_unique');
            $table->unique(['user_id', 'name']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->index();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->index();
        });
    }

    public function down(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'name']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
            $table->unique('name');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
