<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Products/Index', [
            'products' => Product::query()
                ->withCount('ingredients')
                ->orderBy('name')
                ->get(['id', 'name', 'category', 'image_url', 'price', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create', [
            'ingredients' => Ingredient::query()
                ->orderBy('name')
                ->get(['id', 'name', 'unit']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:140'],
            'price' => ['required', 'numeric', 'gt:0'],
            'category' => ['nullable', 'string', 'max:80'],
            'photo' => ['nullable', 'image', 'max:3072'],
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.id' => ['required', 'exists:ingredients,id'],
            'ingredients.*.amount' => ['required', 'numeric', 'gt:0'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $imageUrl = null;

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('products', 'public');
                $imageUrl = Storage::url($path);
            }

            $product = Product::query()->create([
                'name' => $validated['name'],
                'category' => $validated['category'] ?? null,
                'image_url' => $imageUrl,
                'price' => (int) round(((float) $validated['price']) * 100),
                'is_active' => true,
            ]);

            $pivotPayload = collect($validated['ingredients'])
                ->mapWithKeys(function (array $line) {
                    return [
                        $line['id'] => [
                            'amount' => (float) $line['amount'],
                        ],
                    ];
                })
                ->toArray();

            $product->ingredients()->sync($pivotPayload);
        });

        return to_route('products.index')->with('message', 'Produit cree avec recette.');
    }
}
