<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IngredientController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Ingredients/Index', [
            'ingredients' => Ingredient::query()->orderBy('name')->get(),
        ]);
    }

    public function store(StoreIngredientRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Ingredient::create($validated);

        return to_route('ingredients.index')->with('message', 'Ingredient created successfully.');
    }

    public function update(UpdateIngredientRequest $request, Ingredient $ingredient): RedirectResponse
    {
        $validated = $request->validated();

        $ingredient->update($validated);

        return to_route('ingredients.index')->with('message', 'Ingredient updated successfully.');
    }

    public function destroy(Ingredient $ingredient): RedirectResponse
    {
        $ingredient->delete();

        return to_route('ingredients.index')->with('message', 'Ingredient deleted successfully.');
    }
}
