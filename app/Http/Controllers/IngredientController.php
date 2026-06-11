<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use App\Models\Ingredient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IngredientController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $sort = $request->query('sort', 'recent');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $ingredients = Ingredient::query()
            ->when($search, fn ($query) => $query->where('name', 'like', '%'.$search.'%'))
            ->when($status === 'critique', fn ($query) => $query->whereColumn('stock_quantity', '<=', 'alert_threshold'))
            ->when($status === 'stable', fn ($query) => $query->whereColumn('stock_quantity', '>', 'alert_threshold'));

        match ($sort) {
            'name' => $ingredients->orderBy('name', $direction),
            'unit' => $ingredients->orderBy('unit', $direction),
            'stock' => $ingredients->orderBy('stock_quantity', $direction),
            'threshold' => $ingredients->orderBy('alert_threshold', $direction),
            'status' => $ingredients->orderByRaw('(stock_quantity <= alert_threshold) '.$direction),
            default => $ingredients->latest('id'),
        };

        return Inertia::render('Ingredients/Index', [
            'ingredients' => $ingredients->paginate(8)->withQueryString(),
            'lowStockIngredients' => Ingredient::query()
                ->whereColumn('stock_quantity', '<=', 'alert_threshold')
                ->orderByRaw('(stock_quantity - alert_threshold) asc')
                ->take(3)
                ->get(),
            'filters' => ['search' => $search, 'status' => $status, 'sort' => $sort, 'direction' => $direction],
        ]);
    }

    public function store(StoreIngredientRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Ingredient::create($validated);

        return to_route('ingredients.index')->with('message', 'Ingrédient créé.');
    }

    public function update(UpdateIngredientRequest $request, Ingredient $ingredient): RedirectResponse
    {
        $validated = $request->validated();

        $ingredient->update($validated);

        return to_route('ingredients.index')->with('message', 'Ingrédient mis à jour.');
    }

    public function destroy(Ingredient $ingredient): RedirectResponse
    {
        $ingredient->delete();

        return to_route('ingredients.index')->with('message', 'Ingrédient supprimé.');
    }
}
