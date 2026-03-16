<?php

namespace App\Http\Controllers;

use App\Actions\CancelOrderAction;
use App\Actions\SellProductAction;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Exception;
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

    public function store(StoreOrderRequest $request, SellProductAction $sellProductAction)
    {
        $validated = $request->validated();

        try {
            $sellProductAction->execute($validated['items']);

            return back()->with('message', 'Vente réussie! Stock mis à jour');
        } catch (Exception $error) {
            return back()->withErrors(['items' => $error->getMessage()]);
        }
    }

    public function destroy(Order $order, CancelOrderAction $cancelAction)
    {
        $cancelAction->execute($order);

        return back()->with('message', 'Commande annulée et stocks restaurés.');
    }
}
