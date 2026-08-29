<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
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
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $category = $request->query('category');
        $sort = $request->query('sort', 'recent');
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $products = Product::query()
            ->with(['ingredients:id,name,unit,stock_quantity,cost_price', 'images:id,product_id,url,is_main'])
            ->withCount('ingredients')
            ->when($search, fn ($query) => $query->where('name', 'like', '%'.$search.'%'))
            ->when($status === 'active', fn ($query) => $query->where('is_active', true))
            ->when($status === 'inactive', fn ($query) => $query->where('is_active', false))
            ->when($category, fn ($query) => $query->where('category', $category));

        match ($sort) {
            'name' => $products->orderBy('name', $direction),
            'category' => $products->orderBy('category', $direction),
            'price' => $products->orderBy('price', $direction),
            'recipe' => $products->orderBy('ingredients_count', $direction),
            'status' => $products->orderBy('is_active', $direction),
            default => $products->latest('id'),
        };

        $categories = Product::query()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('Products/Index', [
            'categories' => $categories,
            'products' => $products
                ->paginate(8)
                ->withQueryString()
                ->through(fn (Product $product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category,
                    'image_url' => $product->image_url,
                    'images' => $product->images
                        ->map(fn ($image) => [
                            'id' => $image->id,
                            'url' => $image->url,
                            'is_main' => (bool) $image->is_main,
                        ])
                        ->values(),
                    'price' => $product->price,
                    'is_active' => $product->is_active,
                    'is_makeable' => $product->is_makeable,
                    'recipe_cost' => $product->recipe_cost,
                    'margin' => $product->margin,
                    'margin_ratio' => $product->margin_ratio,
                    'ingredients_count' => $product->ingredients_count,
                    'ingredients' => $product->ingredients
                        ->map(fn ($ingredient) => [
                            'id' => $ingredient->id,
                            'name' => $ingredient->name,
                            'unit' => $ingredient->unit,
                            'amount' => $ingredient->pivot?->amount,
                        ])
                        ->values(),
                ]),
            'filters' => ['search' => $search, 'status' => $status, 'category' => $category, 'sort' => $sort, 'direction' => $direction],
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
            'images:id,product_id,url,is_main',
        ]);

        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => ($product->price ?? 0) / 100,
                'category' => $product->category,
                'image_url' => $product->image_url,
                'images' => $product->images
                    ->map(fn ($image) => [
                        'id' => $image->id,
                        'url' => $image->url,
                        'is_main' => (bool) $image->is_main,
                    ])
                    ->values(),
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

    /**
     * Print-friendly recipe sheet (fiche technique) for one product: recipe
     * lines with per-line cost, plus total cost, price and margin.
     */
    public function recipe(Product $product): Response
    {
        $product->load(['ingredients:id,name,unit,cost_price']);

        return Inertia::render('Products/Recipe', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price_in_euro,
                'recipe_cost' => $product->recipe_cost,
                'margin' => $product->margin,
                'margin_ratio' => $product->margin_ratio,
                'ingredients' => $product->ingredients
                    ->map(fn ($ingredient) => [
                        'id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'unit' => $ingredient->unit,
                        'amount' => $ingredient->pivot?->amount,
                        'cost_price' => $ingredient->cost_price,
                        'line_cost' => round(
                            (float) $ingredient->cost_price * (float) ($ingredient->pivot?->amount ?? 0),
                            2,
                        ),
                    ])
                    ->values(),
            ],
            'restaurant' => auth()->user()->name ?? 'ChefFlow',
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

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

        return to_route('products.index')->with('message', 'Produit créé avec recette.');
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $removeIds = $validated['remove_images'] ?? [];
        if ($request->hasFile('images')) {
            $existingCount = $product->images()
                ->whereNotIn('id', $removeIds)
                ->count();
            $newCount = count($request->file('images'));

            if ($existingCount + $newCount > 4) {
                return back()
                    ->withErrors(['images' => 'Maximum 4 images par produit.'])
                    ->withInput();
            }
        }

        DB::transaction(function () use ($request, $validated, $product) {
            $imageUrl = $product->image_url;

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('products', 'public');
                $imageUrl = Storage::url($path);
            }

            if (! empty($validated['remove_images'])) {
                $this->deleteProductImagesByIds($product, $validated['remove_images']);
            }

            $remainingImages = $product->images()->orderBy('id')->get();
            $hasMainImage = $remainingImages->contains('is_main', true);

            if (! $hasMainImage && $remainingImages->isNotEmpty()) {
                // Ensure the gallery always has a single main image for display consistency.
                $remainingImages->each(function ($image, int $index) {
                    $image->update(['is_main' => $index === 0]);
                });
                $imageUrl = $remainingImages->first()->url;
                $hasMainImage = true;
            }

            if ($request->hasFile('images')) {
                $mainImageUrl = $this->appendProductImages(
                    $product,
                    $request->file('images'),
                    ! $hasMainImage
                );

                if ($mainImageUrl) {
                    $imageUrl = $mainImageUrl;
                }
            } elseif ($remainingImages->isEmpty()) {
                $imageUrl = null;
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

        return to_route('products.index')->with('message', 'Produit modifié avec succès.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->deleteProductImages($product);
        $product->delete();

        return to_route('products.index')->with('message', 'Produit supprimé avec succès.');
    }

    public function toggleStatus(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => ! $product->is_active,
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

    private function appendProductImages(
        Product $product,
        array $images,
        bool $setFirstAsMain
    ): ?string {
        $mainImageUrl = null;

        foreach (array_values($images) as $index => $image) {
            $path = $image->store('products', 'public');
            $url = Storage::url($path);
            $isMain = $setFirstAsMain && $index === 0;

            $product->images()->create([
                'url' => $url,
                'is_main' => $isMain,
            ]);

            if ($isMain) {
                $mainImageUrl = $url;
            }
        }

        return $mainImageUrl;
    }

    private function deleteProductImages(Product $product): void
    {
        $images = $product->images()->get(['url']);

        foreach ($images as $image) {
            $path = str_replace('/storage/', '', (string) $image->url);
            Storage::disk('public')->delete($path);
        }

        $product->images()->delete();
    }

    private function deleteProductImagesByIds(Product $product, array $imageIds): void
    {
        $images = $product->images()->whereIn('id', $imageIds)->get(['id', 'url']);

        foreach ($images as $image) {
            $path = str_replace('/storage/', '', (string) $image->url);
            Storage::disk('public')->delete($path);
        }

        $product->images()->whereIn('id', $imageIds)->delete();
    }
}
