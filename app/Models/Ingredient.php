<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use BelongsToTenant;

    protected $fillable = ['name', 'image_url', 'unit', 'stock_quantity', 'alert_threshold', 'cost_price'];

    public function products()
    {
        return $this->belongsToMany(Product::class)->withTimestamps();
    }

    /**
     * Inventory value held in stock for this ingredient: unit cost * quantity,
     * in euros. Appended so the ingredients list can show stock valuation.
     */
    public function stockValue(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => round(
                (float) ($attributes['cost_price'] ?? 0) * (float) ($attributes['stock_quantity'] ?? 0),
                2,
            ),
        );
    }

    public function isLowStock(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (
                    ! array_key_exists('stock_quantity', $attributes) ||
                    ! array_key_exists('alert_threshold', $attributes)
                ) {
                    return false;
                }

                return (float) $attributes['stock_quantity'] <= (float) $attributes['alert_threshold'];
            },
        );
    }

    protected $appends = ['is_low_stock', 'stock_value'];

    protected function casts(): array
    {
        return [
            'cost_price' => 'decimal:4',
        ];
    }
}
