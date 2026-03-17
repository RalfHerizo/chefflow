<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute; 
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category', 'image_url', 'price', 'is_active', 'price_in_euro'];
    
    public function ingredients(): BelongsToMany{

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

    protected function casts(): array{
        return [
            'price'=>'integer',
            'is_active'=>'boolean',
        ];
    }

    protected function priceInEuro(): Attribute{
        return Attribute::make(
            
            get: fn(mixed $value, array $attributes) => ($attributes['price'] ?? 0) / 100, // affichage en euro
            
            set: fn(mixed $value) =>[
                'price' => (int) ($value*100), //Enregistrement du prix en centime
            ]
            
        );
    }
}
