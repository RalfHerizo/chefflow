<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;

class SellProductAction
{
    /**
     * Execute the cart sale and deduct stocks.
     * @throws Exception
     */
    public function execute(array $items): Order
    {
        $normalizedItems = collect($items)
            ->map(function (array $item) {
                $productId = $item['id'] ?? $item['product_id'] ?? null;
                $quantity = $item['qty'] ?? $item['quantity'] ?? null;

                return [
                    'product_id' => $productId,
                    'quantity' => $quantity,
                ];
            })
            ->values();

        $productIds = $normalizedItems->pluck('product_id')->filter()->unique()->values();
        $products = Product::query()
            ->with('ingredients')
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        if ($products->count() !== $productIds->count()) {
            throw new Exception('Product not found.');
        }

        return DB::transaction(function () use ($normalizedItems, $products) {
            $ingredientTotals = [];
            $ingredientModels = [];
            $totalPrice = 0;
            $totalQuantity = 0;

            foreach ($normalizedItems as $item) {
                $product = $products->get($item['product_id']);
                $quantity = (int) $item['quantity'];

                if (!$product) {
                    throw new Exception('Product not found.');
                }

                if ($quantity < 1) {
                    throw new Exception('Invalid quantity.');
                }

                if (!$product->is_active) {
                    throw new Exception('Disabled product');
                }

                $totalPrice += $product->price * $quantity;
                $totalQuantity += $quantity;

                foreach ($product->ingredients as $ingredient) {
                    $required = $ingredient->pivot->amount * $quantity;
                    $ingredientTotals[$ingredient->id] = ($ingredientTotals[$ingredient->id] ?? 0) + $required;
                    $ingredientModels[$ingredient->id] = $ingredient;
                }
            }

            foreach ($ingredientTotals as $ingredientId => $required) {
                $ingredient = $ingredientModels[$ingredientId];

                if ($ingredient->stock_quantity < $required) {
                    throw new Exception("Insufficient stock for the ingredient: {$ingredient->name}");
                }
            }

            foreach ($ingredientTotals as $ingredientId => $required) {
                $ingredientModels[$ingredientId]->decrement('stock_quantity', $required);
            }

            $order = Order::create([
                'quantity' => $totalQuantity,
                'total_price' => $totalPrice,
            ]);

            foreach ($normalizedItems as $item) {
                $product = $products->get($item['product_id']);
                $quantity = (int) $item['quantity'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price_at_sale' => round($product->price / 100, 2),
                ]);
            }

            return $order;
        });
    }
}
