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

        return Inertia::render('Ingredients/Index', [
            'ingredients' => Ingredient::query()
                ->when($search, fn ($query) => $query->where('name', 'like', '%'.$search.'%'))
                ->latest('id')
                ->paginate(8)
                ->withQueryString(),
            'filters' => ['search' => $search],
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
