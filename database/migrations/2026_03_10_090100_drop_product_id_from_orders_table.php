<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=off');
            DB::statement('DROP TABLE IF EXISTS order_items');
            DB::statement('ALTER TABLE orders RENAME TO orders_old');
            DB::statement('CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, quantity INTEGER NOT NULL, total_price INTEGER NOT NULL, created_at DATETIME, updated_at DATETIME)');
            DB::statement('INSERT INTO orders (id, quantity, total_price, created_at, updated_at) SELECT id, quantity, total_price, created_at, updated_at FROM orders_old');
            DB::statement('DROP TABLE orders_old');
            DB::statement('CREATE TABLE order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL, price_at_sale DECIMAL(10, 2) NOT NULL, created_at DATETIME, updated_at DATETIME, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE)');
            DB::statement('PRAGMA foreign_keys=on');
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn('product_id');
        });
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=off');
            DB::statement('ALTER TABLE orders RENAME TO orders_old');
            DB::statement('CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, quantity INTEGER NOT NULL, total_price INTEGER NOT NULL, created_at DATETIME, updated_at DATETIME)');
            DB::statement('INSERT INTO orders (id, quantity, total_price, created_at, updated_at) SELECT id, quantity, total_price, created_at, updated_at FROM orders_old');
            DB::statement('DROP TABLE orders_old');
            DB::statement('PRAGMA foreign_keys=on');
            return;
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained();
        });
    }
};
