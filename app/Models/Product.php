<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = ['name', 'category', 'image_url', 'price', 'is_active', 'price_in_euro'];

    public function ingredients(): BelongsToMany
    {

        return $this->belongsToMany(Ingredient::class)->withPivot('amount')->withTimestamps();

    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function mainImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_main', true);
    }

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected function priceInEuro(): Attribute
    {
        return Attribute::make(

            get: fn (mixed $value, array $attributes) => ($attributes['price'] ?? 0) / 100, // affichage en euro

            set: fn (mixed $value) => [
                'price' => (int) ($value * 100), // Enregistrement du prix en centime
            ]

        );
    }

    /**
     * Derived availability: a product is makeable when every recipe ingredient
     * has enough stock for at least one unit (mirrors SellProductAction's rule).
     * Not appended on purpose — only computed where the recipe is eager-loaded
     * (POS + products index), so it never triggers an N+1 elsewhere.
     */
    protected function isMakeable(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->relationLoaded('ingredients')
                ? $this->ingredients->every(
                    fn (Ingredient $ingredient) => (float) $ingredient->stock_quantity
                        >= (float) ($ingredient->pivot->amount ?? 0)
                )
                : true,
        )->shouldCache();
    }
}
