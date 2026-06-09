<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $currentStart = $now->copy()->subDays(6)->startOfDay();
        $currentEnd = $now->copy()->endOfDay();
        $previousStart = $now->copy()->subDays(13)->startOfDay();
        $previousEnd = $now->copy()->subDays(7)->endOfDay();

        // Weekly revenue chart (last 7 days).
        $revenuesByDate = Order::query()
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->selectRaw('DATE(created_at) as sale_date, SUM(total_price) as revenue_cents')
            ->groupBy('sale_date')
            ->pluck('revenue_cents', 'sale_date');

        $dayLabels = [
            1 => 'Lun', 2 => 'Mar', 3 => 'Mer', 4 => 'Jeu', 5 => 'Ven', 6 => 'Sam', 7 => 'Dim',
        ];

        $weeklyRevenue = collect(range(0, 6))
            ->map(function (int $index) use ($dayLabels, $revenuesByDate, $currentStart) {
                $date = $currentStart->copy()->addDays($index);

                return [
                    'date' => $dayLabels[$date->dayOfWeekIso],
                    'revenue' => round((int) ($revenuesByDate[$date->toDateString()] ?? 0) / 100, 2),
                ];
            })
            ->values();

        // KPIs: current 7-day window compared to the previous 7-day window.
        $currentRevenue = (int) Order::whereBetween('created_at', [$currentStart, $currentEnd])->sum('total_price');
        $previousRevenue = (int) Order::whereBetween('created_at', [$previousStart, $previousEnd])->sum('total_price');
        $currentOrders = Order::whereBetween('created_at', [$currentStart, $currentEnd])->count();
        $previousOrders = Order::whereBetween('created_at', [$previousStart, $previousEnd])->count();
        $currentAvg = $currentOrders > 0 ? (int) round($currentRevenue / $currentOrders) : 0;
        $previousAvg = $previousOrders > 0 ? (int) round($previousRevenue / $previousOrders) : 0;

        $delta = fn (int|float $current, int|float $previous) => $previous > 0
            ? (int) round((($current - $previous) / $previous) * 100)
            : null;

        return Inertia::render('Dashboard', [
            'stats' => [
                'revenue' => ['value' => $currentRevenue, 'delta' => $delta($currentRevenue, $previousRevenue)],
                'orders' => ['value' => $currentOrders, 'delta' => $delta($currentOrders, $previousOrders)],
                'avgBasket' => ['value' => $currentAvg, 'delta' => $delta($currentAvg, $previousAvg)],
                'lowStock' => ['value' => Ingredient::whereColumn('stock_quantity', '<=', 'alert_threshold')->count()],
            ],
            'weeklyRevenue' => $weeklyRevenue,
            'topProducts' => OrderItem::query()
                ->whereHas('order')
                ->whereHas('product')
                ->selectRaw('product_id, SUM(quantity) as total_qty')
                ->groupBy('product_id')
                ->orderByDesc('total_qty')
                ->with('product:id,name,image_url')
                ->limit(5)
                ->get()
                ->map(fn (OrderItem $item) => [
                    'id' => $item->product_id,
                    'name' => $item->product?->name,
                    'image_url' => $item->product?->image_url,
                    'quantity' => (int) $item->total_qty,
                ])
                ->values(),
            'orders' => Order::with('items.product')->latest('id')->take(5)->get(),
            'ingredients' => Ingredient::query()->latest('id')->take(6)->get(),
        ]);
    }
}
