<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$product = App\Models\Product::with('images')->latest()->first();
if (!$product) {
    var_export(['product_id' => null]);
    exit;
}

$images = $product->images;
$out = [
    'product_id' => $product->id,
    'images_count' => $images->count(),
    'main_images' => $images->where('is_main', true)->count(),
    'images' => $images->map(function ($img) {
        return [
            'id' => $img->id,
            'url' => $img->url,
            'is_main' => $img->is_main,
        ];
    })->all(),
];

var_export($out);
