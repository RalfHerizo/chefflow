<?php

namespace App\Http\Controllers;

use App\Actions\CancelOrderAction;
use App\Actions\SellProductAction;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function pos()
    {
        return Inertia::render('Orders/Pos', [
            'products' => Product::query()
                ->with('ingredients:id,name')
                ->orderBy('name')
                ->get(['id', 'name', 'price', 'image_url', 'category', 'is_active'])
                ->map(function (Product $product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => $product->price,
                        'image_url' => $product->image_url,
                        'category' => $product->category,
                        'is_active' => $product->is_active,
                        'ingredients' => $product->ingredients
                            ->map(fn ($ingredient) => [
                                'id' => $ingredient->id,
                                'name' => $ingredient->name,
                            ])
                            ->values(),
                    ];
                })
                ->values(),
        ]);
    }

    public function store(Request $request, SellProductAction $sellProductAction)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $sellProductAction->execute($validated['items']);

            return back()->with('message', 'vente rÃ©ussie! Stock mis Ã  jour');
        } catch (Exception $error) {
            return back()->withErrors(['error' => $error->getMessage()]);
        }
    }

    public function destroy(Order $order, CancelOrderAction $cancelAction)
    {
        $cancelAction->execute($order);

        return back()->with('message', 'Commande annulÃ©e et stocks restaurÃ©s.');
    }
}
