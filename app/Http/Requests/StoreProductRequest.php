<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:140'],
            'price' => ['required', 'numeric', 'gt:0'],
            'category' => ['nullable', 'string', 'max:80'],
            'photo' => ['nullable', 'image', 'max:3072'],
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_images' => ['nullable', 'array'],
            'remove_images.*' => ['integer', 'exists:product_images,id'],
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.id' => ['required', 'exists:ingredients,id'],
            'ingredients.*.amount' => ['required', 'numeric', 'gt:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit etre une chaine de caracteres.',
            'name.max' => 'Le nom ne doit pas depasser 140 caracteres.',
            'price.required' => 'Le prix est obligatoire.',
            'price.numeric' => 'Le prix doit etre un nombre.',
            'price.gt' => 'Le prix doit etre superieur a 0.',
            'category.string' => 'La categorie doit etre une chaine de caracteres.',
            'category.max' => 'La categorie ne doit pas depasser 80 caracteres.',
            'photo.image' => 'La photo doit etre une image.',
            'photo.max' => 'La photo ne doit pas depasser 3 Mo.',
            'images.array' => 'Le format des images est invalide.',
            'images.max' => 'Vous pouvez ajouter au maximum 4 images.',
            'images.*.image' => 'Chaque fichier doit etre une image.',
            'images.*.mimes' => 'Formats acceptes: jpg, jpeg, png, webp.',
            'images.*.max' => 'Chaque image ne doit pas depasser 2 Mo.',
            'ingredients.required' => 'Veuillez ajouter au moins un ingredient.',
            'ingredients.array' => 'Le format des ingredients est invalide.',
            'ingredients.min' => 'Veuillez ajouter au moins un ingredient.',
            'ingredients.*.id.required' => 'Chaque ingredient doit etre selectionne.',
            'ingredients.*.id.exists' => 'Ingredient selectionne invalide.',
            'ingredients.*.amount.required' => 'La quantite est obligatoire.',
            'ingredients.*.amount.numeric' => 'La quantite doit etre un nombre.',
            'ingredients.*.amount.gt' => 'La quantite doit etre superieure a 0.',
            'remove_images.array' => 'Le format des images a supprimer est invalide.',
            'remove_images.*.integer' => 'Les identifiants des images sont invalides.',
            'remove_images.*.exists' => 'Une image a supprimer est introuvable.',
        ];
    }
}
