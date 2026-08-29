<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Global typeahead search across the current tenant's products,
     * ingredients and orders. Returns grouped JSON for the header dropdown.
     * All models are tenant-scoped via BelongsToTenant under the auth guard.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $term = trim((string) $request->query('q', ''));

        $empty = ['products' => [], 'ingredients' => [], 'orders' => []];

        if (mb_strlen($term) < 2) {
            return response()->json($empty);
        }

        $like = '%'.$term.'%';

        $products = Product::query()
            ->where('name', 'like', $like)
            ->orderBy('name')
            ->take(5)
            ->get(['id', 'name', 'category'])
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
            ])
            ->values();

        $ingredients = Ingredient::query()
            ->where('name', 'like', $like)
            ->orderBy('name')
            ->take(5)
            ->get(['id', 'name', 'unit'])
            ->map(fn (Ingredient $ingredient) => [
                'id' => $ingredient->id,
                'name' => $ingredient->name,
                'unit' => $ingredient->unit,
            ])
            ->values();

        $orders = Order::query()
            ->where(function ($query) use ($term, $like) {
                $query->whereHas('items.product', fn ($product) => $product->where('name', 'like', $like));

                if (is_numeric($term)) {
                    $query->orWhere('id', (int) $term);
                }
            })
            ->latest('id')
            ->take(5)
            ->get(['id', 'total_price', 'created_at'])
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'total_price' => $order->total_price,
                'created_at' => $order->created_at,
            ])
            ->values();

        return response()->json([
            'products' => $products,
            'ingredients' => $ingredients,
            'orders' => $orders,
        ]);
    }
}
