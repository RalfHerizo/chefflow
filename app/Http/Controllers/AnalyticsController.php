<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * Sales analytics for the current tenant over a 7 / 30 / 90 day window.
     * Money is exposed in euros (Order.total_price is cents; OrderItem
     * price_at_sale is already euros — both reconciled here).
     */
    public function index(Request $request): Response
    {
        $days = (int) $request->query('period', 30);
        if (! in_array($days, [7, 30, 90], true)) {
            $days = 30;
        }

        $now = Carbon::now();
        $start = $now->copy()->subDays($days - 1)->startOfDay();
        $end = $now->copy()->endOfDay();
        $prevStart = $now->copy()->subDays(2 * $days - 1)->startOfDay();
        $prevEnd = $now->copy()->subDays($days)->endOfDay();

        // KPIs: current window vs the previous window of equal length.
        $revenueCents = (int) Order::whereBetween('created_at', [$start, $end])->sum('total_price');
        $prevRevenueCents = (int) Order::whereBetween('created_at', [$prevStart, $prevEnd])->sum('total_price');
        $orders = Order::whereBetween('created_at', [$start, $end])->count();
        $prevOrders = Order::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $items = (int) Order::whereBetween('created_at', [$start, $end])->sum('quantity');
        $prevItems = (int) Order::whereBetween('created_at', [$prevStart, $prevEnd])->sum('quantity');
        $avgCents = $orders > 0 ? (int) round($revenueCents / $orders) : 0;
        $prevAvgCents = $prevOrders > 0 ? (int) round($prevRevenueCents / $prevOrders) : 0;

        $delta = fn (int|float $current, int|float $previous) => $previous > 0
            ? (int) round((($current - $previous) / $previous) * 100)
            : null;

        // Daily revenue trend (euros per day, gaps filled with 0).
        $revenuesByDate = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DATE(created_at) as sale_date, SUM(total_price) as revenue_cents')
            ->groupBy('sale_date')
            ->pluck('revenue_cents', 'sale_date');

        $revenueTrend = collect(range(0, $days - 1))
            ->map(function (int $i) use ($start, $revenuesByDate) {
                $date = $start->copy()->addDays($i);

                return [
                    'date' => $date->format('d/m'),
                    'revenue' => round((int) ($revenuesByDate[$date->toDateString()] ?? 0) / 100, 2),
                ];
            })
            ->values();

        // Revenue by product category (tenant scope flows from the Order query).
        $categoryRevenue = Order::query()
            ->whereBetween('orders.created_at', [$start, $end])
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->selectRaw('products.category as category, SUM(order_items.quantity * order_items.price_at_sale) as revenue_eur')
            ->groupBy('products.category')
            ->orderByDesc('revenue_eur')
            ->get()
            ->map(fn ($row) => [
                'category' => $row->category ?: 'Sans catégorie',
                'revenue' => round((float) $row->revenue_eur, 2),
            ])
            ->values();

        // Units sold per product over the window (revenue in euros) — drives
        // both the best-sellers list and the food-cost / margin figures.
        $soldProducts = OrderItem::query()
            ->whereHas('order', fn ($query) => $query->whereBetween('created_at', [$start, $end]))
            ->whereHas('product')
            ->selectRaw('product_id, SUM(quantity) as total_qty, SUM(quantity * price_at_sale) as revenue_eur')
            ->groupBy('product_id')
            ->get();

        // Resolve each sold product's per-unit recipe cost in a single batch
        // (recipe_cost is computed from the eager-loaded ingredients).
        $products = Product::query()
            ->with('ingredients:id,cost_price')
            ->whereIn('id', $soldProducts->pluck('product_id'))
            ->get(['id', 'name', 'image_url'])
            ->keyBy('id');

        $totalCostEur = 0.0;
        $totalSalesEur = 0.0;

        $rows = $soldProducts
            ->map(function (OrderItem $item) use ($products, &$totalCostEur, &$totalSalesEur) {
                $product = $products->get($item->product_id);
                $quantity = (int) $item->total_qty;
                $revenue = round((float) $item->revenue_eur, 2);
                $cost = round(((float) ($product?->recipe_cost ?? 0)) * $quantity, 2);
                $margin = round($revenue - $cost, 2);

                $totalCostEur += $cost;
                $totalSalesEur += $revenue;

                return [
                    'id' => $item->product_id,
                    'name' => $product?->name,
                    'image_url' => $product?->image_url,
                    'quantity' => $quantity,
                    'revenue' => $revenue,
                    'cost' => $cost,
                    'margin' => $margin,
                    'margin_ratio' => $revenue > 0 ? (int) round(($margin / $revenue) * 100) : null,
                ];
            });

        // Best sellers by revenue, and most profitable dishes by total margin.
        $topProducts = $rows->sortByDesc('revenue')->take(8)->values();
        $topProfitable = $rows->sortByDesc('margin')->take(8)->values();

        $grossMargin = round($totalSalesEur - $totalCostEur, 2);
        $foodCostRatio = $totalSalesEur > 0
            ? (int) round(($totalCostEur / $totalSalesEur) * 100)
            : null;

        return Inertia::render('Analytics/Index', [
            'period' => $days,
            'kpis' => [
                'revenue' => ['value' => round($revenueCents / 100, 2), 'delta' => $delta($revenueCents, $prevRevenueCents)],
                'orders' => ['value' => $orders, 'delta' => $delta($orders, $prevOrders)],
                'avgBasket' => ['value' => round($avgCents / 100, 2), 'delta' => $delta($avgCents, $prevAvgCents)],
                'itemsSold' => ['value' => $items, 'delta' => $delta($items, $prevItems)],
            ],
            'revenueTrend' => $revenueTrend,
            'categoryRevenue' => $categoryRevenue,
            'topProducts' => $topProducts,
            'topProfitable' => $topProfitable,
            'profitability' => [
                'grossMargin' => $grossMargin,
                'foodCostRatio' => $foodCostRatio,
                'totalCost' => round($totalCostEur, 2),
            ],
        ]);
    }
}
