<?php

namespace App\Http\Controllers;

use App\Actions\CancelOrderAction;
use App\Actions\SellProductAction;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->query('sort', 'recent');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $orders = Order::query()->with('items.product');

        match ($sort) {
            'total' => $orders->orderBy('total_price', $direction),
            default => $orders->latest('id'),
        };

        return Inertia::render('Orders/Index', [
            'orders' => $orders
                ->paginate(10)
                ->withQueryString()
                ->through(fn (Order $order) => [
                    'id' => $order->id,
                    'total_price' => $order->total_price,
                    'quantity' => $order->quantity,
                    'items' => $order->items
                        ->map(fn ($item) => [
                            'quantity' => $item->quantity,
                            'product' => $item->product ? [
                                'name' => $item->product->name,
                                'image_url' => $item->product->image_url,
                            ] : null,
                        ])
                        ->values(),
                ]),
            'filters' => ['sort' => $sort, 'direction' => $direction],
        ]);
    }

    public function pos()
    {
        return Inertia::render('Orders/Pos', [
            'products' => Product::query()
                ->with(['ingredients:id,name', 'images:id,product_id,url,is_main'])
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
                        'images' => $product->images
                            ->map(fn ($image) => [
                                'id' => $image->id,
                                'url' => $image->url,
                                'is_main' => (bool) $image->is_main,
                            ])
                            ->values(),
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
