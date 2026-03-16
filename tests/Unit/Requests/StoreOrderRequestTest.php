<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Product;

uses(\Tests\TestCase::class, RefreshDatabase::class);

function makeValidator(array $data): \Illuminate\Validation\Validator
{
    $request = new StoreOrderRequest();
    return Validator::make($data, $request->rules(), $request->messages());
}

beforeEach(function () {
    $this->product = Product::factory()->create([
        'id'    => 1,
        'price' => 1200,
    ]);
});

describe('valid payload', function () {
    it('passes with a valid single item', function () {
        $validator = makeValidator(['items' => [['id' => 1, 'quantity' => 2]]]);
        expect($validator->passes())->toBeTrue();
    });
});

describe('items field', function () {
    it('fails when items is missing', function () {
        $validator = makeValidator([]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items'))->toBeTrue();
        expect($validator->errors()->first('items'))->toBe('Le panier ne peut pas être vide.');
    });

    it('fails when items is an empty array', function () {
        $validator = makeValidator(['items' => []]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items'))->toBeTrue();
        expect($validator->errors()->first('items'))->toBe('Le panier ne peut pas être vide.');
    });

    it('fails when items is not an array', function () {
        $validator = makeValidator(['items' => 'not-an-array']);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items'))->toBeTrue();
    });
});

describe('items.*.id field', function () {
    it('fails when product id does not exist in database', function () {
        $validator = makeValidator(['items' => [['id' => 9999, 'quantity' => 1]]]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items.0.id'))->toBeTrue();
        expect($validator->errors()->first('items.0.id'))
            ->toBe("Le produit sélectionné n'existe plus en catalogue.");
    });

    it('fails when product id is missing from item', function () {
        $validator = makeValidator(['items' => [['quantity' => 1]]]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items.0.id'))->toBeTrue();
        expect($validator->errors()->first('items.0.id'))
            ->toBe('Chaque article doit avoir un identifiant.');
    });
});

describe('items.*.quantity field', function () {
    it('fails when quantity is zero', function () {
        $validator = makeValidator(['items' => [['id' => 1, 'quantity' => 0]]]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items.0.quantity'))->toBeTrue();
        expect($validator->errors()->first('items.0.quantity'))
            ->toBe('La quantité minimum est de 1 article.');
    });

    it('fails when quantity is negative', function () {
        $validator = makeValidator(['items' => [['id' => 1, 'quantity' => -1]]]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items.0.quantity'))->toBeTrue();
    });

    it('fails when quantity is missing', function () {
        $validator = makeValidator(['items' => [['id' => 1]]]);
        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('items.0.quantity'))->toBeTrue();
        expect($validator->errors()->first('items.0.quantity'))
            ->toBe('La quantité est obligatoire.');
    });
});

describe('french error messages', function () {
    it('returns the correct French message for each rule', function () {
        $messages = (new StoreOrderRequest())->messages();

        expect($messages)->toHaveKey('items.required')
            ->and($messages['items.required'])->toBe('Le panier ne peut pas être vide.')
            ->and($messages)->toHaveKey('items.*.id.exists')
            ->and($messages['items.*.id.exists'])->toBe("Le produit sélectionné n'existe plus en catalogue.")
            ->and($messages)->toHaveKey('items.*.quantity.min')
            ->and($messages['items.*.quantity.min'])->toBe('La quantité minimum est de 1 article.');
    });
});
