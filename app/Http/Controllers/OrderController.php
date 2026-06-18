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
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    /**
     * Shared, tenant-scoped query for the history list and the CSV export so
     * both honour the exact same search / period / sort filters.
     */
    private function filteredOrders(Request $request)
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

        return $orders;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $period = $request->query('period');
        $sort = $request->query('sort', 'recent');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $orders = $this->filteredOrders($request);

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

    /**
     * Stream the filtered orders as a CSV (";" delimiter + UTF-8 BOM so French
     * Excel opens it cleanly). One row per order, with a human-readable detail.
     */
    public function export(Request $request): StreamedResponse
    {
        $orders = $this->filteredOrders($request)->get();

        $filename = 'commandes-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($orders) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF"); // BOM for Excel

            fputcsv($handle, ['N° commande', 'Date', 'Nb articles', 'Total HT (€)', 'Détail'], ';');

            foreach ($orders as $order) {
                $detail = $order->items
                    ->map(fn ($item) => ($item->product->name ?? 'Produit supprimé').' ×'.$item->quantity)
                    ->implode(' ; ');

                fputcsv($handle, [
                    $order->id,
                    optional($order->created_at)->format('d/m/Y H:i'),
                    $order->quantity,
                    number_format($order->total_price / 100, 2, ',', ''),
                    $detail,
                ], ';');
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /**
     * Print-friendly receipt for a single order. Tenant-scoped through the
     * Order route binding (BelongsToTenant global scope → 404 cross-tenant).
     */
    public function receipt(Order $order)
    {
        $order->load('items.product:id,name');

        return Inertia::render('Orders/Receipt', [
            'order' => [
                'id' => $order->id,
                'created_at' => $order->created_at,
                'total_price' => $order->total_price, // HT, in cents
                'items' => $order->items
                    ->map(fn ($item) => [
                        'name' => $item->product->name ?? 'Produit supprimé',
                        'quantity' => $item->quantity,
                        'price_at_sale' => $item->price_at_sale, // euros per unit
                    ])
                    ->values(),
            ],
            'restaurant' => auth()->user()->name ?? 'ChefFlow',
        ]);
    }

    public function pos()
    {
        return Inertia::render('Orders/Pos', [
            'products' => Product::query()
                ->with(['ingredients:id,name,stock_quantity', 'images:id,product_id,url,is_main'])
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
                        'is_makeable' => $product->is_makeable,
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
            $order = $sellProductAction->execute($validated['items']);

            return back()
                ->with('message', 'Commande enregistrée, stock mis à jour.')
                ->with('orderId', $order->id);
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
