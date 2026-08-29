<?php

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function pricedProduct(string $productName = 'Pizza Margherita', int $price = 1200, float $amount = 0.1): Product
{
    $flour = Ingredient::create(['name' => 'Farine '.$productName, 'unit' => 'kg', 'stock_quantity' => 100, 'alert_threshold' => 5, 'cost_price' => 1.20]);
    $product = Product::create(['name' => $productName, 'price' => $price, 'category' => 'Plat', 'is_active' => true]);
    $product->ingredients()->attach($flour->id, ['amount' => $amount]);

    return $product;
}

test('the orders CSV export streams the filtered orders', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $product = pricedProduct();
    $this->post(route('orders.store'), ['items' => [['id' => $product->id, 'quantity' => 2]]])->assertSessionHasNoErrors();

    $response = $this->get(route('orders.export'));

    $response->assertOk();
    $response->assertDownload();

    $csv = $response->streamedContent();
    expect($csv)->toContain('N° commande');
    expect($csv)->toContain('Pizza Margherita ×2');
});

test('the CSV export only includes the current tenant orders', function () {
    $other = User::factory()->create();
    $this->actingAs($other);
    $product = pricedProduct('Secret Burger');
    $this->post(route('orders.store'), ['items' => [['id' => $product->id, 'quantity' => 1]]])->assertSessionHasNoErrors();

    $owner = User::factory()->create();
    $this->actingAs($owner);

    $csv = $this->get(route('orders.export'))->streamedContent();
    expect($csv)->not->toContain('Secret Burger');
});

test('the receipt page renders for an order', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $product = pricedProduct();
    $this->post(route('orders.store'), ['items' => [['id' => $product->id, 'quantity' => 2]]])->assertSessionHasNoErrors();
    $order = Order::latest('id')->firstOrFail();

    $this->get(route('orders.receipt', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Orders/Receipt')
            ->where('order.id', $order->id)
            ->where('order.total_price', 2400) // 1200 HT * 2
            ->has('order.items', 1)
            ->where('order.items.0.name', 'Pizza Margherita')
            ->where('order.items.0.quantity', 2)
        );
});

test('a user cannot open another account receipt', function () {
    $other = User::factory()->create();
    $this->actingAs($other);
    $product = pricedProduct();
    $this->post(route('orders.store'), ['items' => [['id' => $product->id, 'quantity' => 2]]])->assertSessionHasNoErrors();
    $order = Order::latest('id')->firstOrFail();

    $owner = User::factory()->create();
    $this->actingAs($owner);

    $this->get(route('orders.receipt', $order))->assertNotFound();
});

test('the recipe sheet exposes recipe lines with cost and margin', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $flour = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 5, 'cost_price' => 1.20]);
    $product = Product::create(['name' => 'Pizza', 'price' => 1200, 'category' => 'Plat', 'is_active' => true]);
    $product->ingredients()->attach($flour->id, ['amount' => 0.25]); // line cost 0.30 €

    $this->get(route('products.recipe', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Products/Recipe')
            ->where('product.id', $product->id)
            ->where('product.recipe_cost', fn ($value) => round((float) $value, 2) === 0.3)
            ->where('product.ingredients.0.line_cost', fn ($value) => round((float) $value, 2) === 0.3)
            ->where('product.margin', fn ($value) => round((float) $value, 2) === 11.7)
        );
});

test('a user cannot open another account recipe sheet', function () {
    $other = User::factory()->create();
    $this->actingAs($other);
    $product = Product::create(['name' => 'Secret', 'price' => 900, 'is_active' => true]);

    $owner = User::factory()->create();
    $this->actingAs($owner);

    $this->get(route('products.recipe', $product))->assertNotFound();
});
