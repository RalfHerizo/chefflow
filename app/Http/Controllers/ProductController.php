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
                ->with(['ingredients:id,name,unit'])
                ->withCount('ingredients')
                ->orderBy('name')
                ->get(['id', 'name', 'category', 'image_url', 'price', 'is_active'])
                ->map(function (Product $product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'category' => $product->category,
                        'image_url' => $product->image_url,
                        'price' => $product->price,
                        'is_active' => $product->is_active,
                        'ingredients_count' => $product->ingredients_count,
                        'ingredients' => $product->ingredients
                            ->map(fn ($ingredient) => [
                                'id' => $ingredient->id,
                                'name' => $ingredient->name,
                                'unit' => $ingredient->unit,
                                'amount' => $ingredient->pivot?->amount,
                            ])
                            ->values(),
                    ];
                })
                ->values(),
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

    public function edit(Product $product): Response
    {
        $product->load([
            'ingredients:id,name,unit',
        ]);

        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => ($product->price ?? 0) / 100,
                'category' => $product->category,
                'image_url' => $product->image_url,
                'is_active' => $product->is_active,
                'ingredients' => $product->ingredients
                    ->map(fn ($ingredient) => [
                        'id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'unit' => $ingredient->unit,
                        'amount' => $ingredient->pivot?->amount,
                    ])
                    ->values(),
            ],
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
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
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

            if ($request->hasFile('images')) {
                $mainImageUrl = $this->storeProductImages(
                    $product,
                    $request->file('images'),
                );

                if ($mainImageUrl) {
                    $product->update(['image_url' => $mainImageUrl]);
                }
            }

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

    public function update(Request $request, Product $product): RedirectResponse
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

        DB::transaction(function () use ($request, $validated, $product) {
            $imageUrl = $product->image_url;

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('products', 'public');
                $imageUrl = Storage::url($path);
            }

            $product->update([
                'name' => $validated['name'],
                'category' => $validated['category'] ?? null,
                'image_url' => $imageUrl,
                'price' => (int) round(((float) $validated['price']) * 100),
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

        return to_route('products.index')->with('message', 'Produit modifie avec succes.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return to_route('products.index')->with('message', 'Produit supprime avec succes.');
    }

    public function toggleStatus(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => !$product->is_active,
        ]);

        return back();
    }

    private function storeProductImages(Product $product, array $images): ?string
    {
        $mainImageUrl = null;

        foreach (array_values($images) as $index => $image) {
            $path = $image->store('products', 'public');
            $url = Storage::url($path);

            $product->images()->create([
                'url' => $url,
                'is_main' => $index === 0,
            ]);

            if ($index === 0) {
                $mainImageUrl = $url;
            }
        }

        return $mainImageUrl;
    }
}
