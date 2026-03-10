<?php

namespace App\Actions;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class CancelOrderAction
{
    public function execute(Order $order): void
    {
        $order->load('items.product.ingredients');

        DB::transaction(function () use ($order) {
            $ingredientTotals = [];
            $ingredientModels = [];

            foreach ($order->items as $item) {
                $product = $item->product;

                foreach ($product->ingredients as $ingredient) {
                    $toRestore = $ingredient->pivot->amount * $item->quantity;
                    $ingredientTotals[$ingredient->id] = ($ingredientTotals[$ingredient->id] ?? 0) + $toRestore;
                    $ingredientModels[$ingredient->id] = $ingredient;
                }
            }

            foreach ($ingredientTotals as $ingredientId => $toRestore) {
                $ingredientModels[$ingredientId]->increment('stock_quantity', $toRestore);
            }

            $order->delete();
        });
    }
}
