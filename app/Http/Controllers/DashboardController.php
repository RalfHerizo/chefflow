<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $revenuesByDate = Order::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as sale_date, SUM(total_price) as revenue_cents')
            ->groupBy('sale_date')
            ->pluck('revenue_cents', 'sale_date');

        $dayLabels = [
            1 => 'Lun',
            2 => 'Mar',
            3 => 'Mer',
            4 => 'Jeu',
            5 => 'Ven',
            6 => 'Sam',
            7 => 'Dim',
        ];

        $weeklyRevenue = collect(range(0, 6))
            ->map(function (int $index) use ($dayLabels, $revenuesByDate, $startDate) {
                $date = $startDate->copy()->addDays($index);
                $revenueCents = (int) ($revenuesByDate[$date->toDateString()] ?? 0);

                return [
                    'date' => $dayLabels[$date->dayOfWeekIso],
                    'revenue' => round($revenueCents / 100, 2),
                ];
            })
            ->values();

        return Inertia::render('Dashboard',[
            'ingredients' => Ingredient::all(),
            'products' => Product::all(),
            'orders' => Order::with('items.product')->latest()->take(10)->get(),
            'weeklyRevenue' => $weeklyRevenue,
        ]);
    }
}
