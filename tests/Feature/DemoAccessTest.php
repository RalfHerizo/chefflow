<?php

use App\Models\Product;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('the public demo route logs in and lands on the dashboard', function () {
    $this->get('/demo')->assertRedirect(route('dashboard'));

    $demo = User::where('email', config('demo.email'))->first();

    expect($demo)->not->toBeNull();
    $this->assertAuthenticatedAs($demo);
});

test('visiting the demo seeds sample data for the demo tenant', function () {
    $this->get('/demo');

    $demo = User::where('email', config('demo.email'))->firstOrFail();

    expect(Product::where('user_id', $demo->id)->count())->toBeGreaterThan(0);
});

test('a non-demo user cannot reset the demo', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('demo.reset'))->assertForbidden();
});

test('the demo account can reset its own data', function () {
    $this->get('/demo'); // log in as demo + seed

    $this->post(route('demo.reset'))
        ->assertRedirect()
        ->assertSessionHas('message');
});

test('the demo account cannot delete itself or change its password', function () {
    $this->get('/demo'); // log in as demo

    $this->delete(route('profile.destroy'), ['password' => 'irrelevant'])
        ->assertForbidden();

    $this->put(route('password.update'), [
        'current_password' => 'irrelevant',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertForbidden();
});

test('the demo account is redirected away from the settings page', function () {
    $this->get('/demo'); // log in as demo

    $this->get(route('profile.edit'))->assertRedirect(route('dashboard'));
});
