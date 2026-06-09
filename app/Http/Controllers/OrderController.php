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
        $search = $request->query('search');
        $period = $request->query('period');
        $sort = $request->query('sort', 'recent');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $orders = Order::query()
            ->with('items.product')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($inner) use ($search) {
                    $inner->whereHas('items.product', fn ($product) => $product->where('name', 'like', '%'.$search.'%'));
                    if (is_numeric($search)) {
                        $inner->orWhere('id', (int) $search);
                    }
                });
            })
            ->when($period === 'today', fn ($query) => $query->whereDate('created_at', now()->toDateString()))
            ->when($period === '7d', fn ($query) => $query->where('created_at', '>=', now()->subDays(6)->startOfDay()))
            ->when($period === '30d', fn ($query) => $query->where('created_at', '>=', now()->subDays(29)->startOfDay()));

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
                    'created_at' => $order->created_at,
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
            'filters' => ['search' => $search, 'period' => $period, 'sort' => $sort, 'direction' => $direction],
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

            return back()->with('message', 'Commande enregistrée, stock mis à jour.');
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
