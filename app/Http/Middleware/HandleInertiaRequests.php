<?php

namespace App\Http\Middleware;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'isDemo' => fn () => optional($request->user())->email === config('demo.email'),
            // Powers the low-stock badge in the sidebar (tenant-scoped; the
            // Ingredient global scope only applies when authenticated).
            'lowStockCount' => fn () => $request->user()
                ? Ingredient::whereColumn('stock_quantity', '<=', 'alert_threshold')->count()
                : 0,
        ];
    }
}
