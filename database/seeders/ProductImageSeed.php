<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductImageSeed extends Seeder
{
    public function run(): void
    {
        $product = Product::create([
            'name' => 'Seeded Product',
            'category' => null,
            'image_url' => null,
            'price' => 500,
            'is_active' => true,
        ]);

        $urls = [
            '/storage/products/seed1.jpg',
            '/storage/products/seed2.jpg',
            '/storage/products/seed3.jpg',
        ];

        foreach ($urls as $index => $url) {
            $product->images()->create([
                'url' => $url,
                'is_main' => $index === 0,
            ]);
        }

        $product->update(['image_url' => $urls[0]]);
    }
}
