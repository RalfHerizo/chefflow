import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    convertAmount,
    formatAmountDisplay,
    getInputStep,
    getPreferredInputUnit,
    getUnitOptions,
} from '@/lib/amountConversion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORY_OPTIONS = ['Entree', 'Plat', 'Dessert', 'Boisson'];
const EMPTY_LINE = { id: '', amount: '', input_amount: '', input_unit: '' };

/**
 * @param {{
 * product: {id: number|string, name: string, price: number|string, category?: string|null, image_url?: string|null, ingredients?: Array<{id: number|string, amount: number|string}>},
 * ingredients: Array<{id: number|string, name: string, unit: string}>
 * }} props
 */
export default function EditProduct({ product, ingredients }) {
    const [photoPreview, setPhotoPreview] = useState(product.image_url || null);
    const [clientErrors, setClientErrors] = useState({});

    const { data, setData, patch, processing, errors } = useForm({
        name: product.name ?? '',
        price: product.price ?? '',
        category: product.category ?? '',
        photo: null,
        ingredients:
            product.ingredients?.length > 0
                ? product.ingredients.map((line) => {
                      const baseUnit = line.unit || 'pcs';
                      const inputUnit = getPreferredInputUnit(baseUnit);
                      const inputAmount = convertAmount(line.amount || 0, baseUnit, inputUnit);

                      return {
                          id: String(line.id),
                          amount: String(line.amount),
                          input_unit: inputUnit,
                          input_amount: String(inputAmount),
                      };
                  })
                : [{ ...EMPTY_LINE }],
    });

    const selectedIngredientsCount = useMemo(
        () => data.ingredients.filter((line) => Boolean(line.id)).length,
        [data.ingredients],
    );
    const hasIngredients = ingredients.length > 0;
    const ingredientsById = useMemo(
        () => new Map(ingredients.map((ingredient) => [String(ingredient.id), ingredient])),
        [ingredients],
    );

    const addIngredient = () => {
        setData('ingredients', [...data.ingredients, { ...EMPTY_LINE }]);
    };

    const removeIngredient = (index) => {
        const next = data.ingredients.filter((_, i) => i !== index);
        setData('ingredients', next.length ? next : [{ ...EMPTY_LINE }]);
    };

    const updateIngredientLine = (index, key, value) => {
        const next = [...data.ingredients];
        next[index] = { ...next[index], [key]: value };
        setData('ingredients', next);
    };

    const updateLineWithInputAmount = (index, newInputAmount, inputUnit, baseUnit) => {
        const amountInBase = convertAmount(newInputAmount || 0, inputUnit, baseUnit);

        const next = [...data.ingredients];
        next[index] = {
            ...next[index],
            input_amount: newInputAmount,
            input_unit: inputUnit,
            amount: String(amountInBase),
        };
        setData('ingredients', next);
    };

    const handleIngredientChange = (index, ingredientId) => {
        const ingredient = ingredientsById.get(String(ingredientId));
        const baseUnit = ingredient?.unit || 'pcs';
        const preferredUnit = getPreferredInputUnit(baseUnit);

        const next = [...data.ingredients];
        next[index] = {
            ...next[index],
            id: ingredientId,
            input_unit: preferredUnit,
            input_amount: '',
            amount: '',
        };
        setData('ingredients', next);
    };

    const handleUnitChange = (index, nextInputUnit) => {
        const line = data.ingredients[index];
        const ingredient = ingredientsById.get(String(line.id));
        if (!ingredient) {
            return;
        }

        const currentInputUnit = line.input_unit || getPreferredInputUnit(ingredient.unit);
        const currentInputAmount = Number(line.input_amount || 0);
        const convertedInputAmount = convertAmount(
            currentInputAmount,
            currentInputUnit,
            nextInputUnit,
        );

        updateLineWithInputAmount(
            index,
            line.input_amount ? String(convertedInputAmount) : '',
            nextInputUnit,
            ingredient.unit,
        );
    };

    const onPhotoChange = (event) => {
        const file = event.target.files?.[0] || null;
        setData('photo', file);

        if (!file) {
            setPhotoPreview(product.image_url || null);
            return;
        }

        setPhotoPreview(URL.createObjectURL(file));
    };

    const validateClientSide = () => {
        const nextErrors = {};

        if (!data.price || Number(data.price) <= 0) {
            nextErrors.price = 'Le prix doit etre positif.';
        }

        const hasIngredient = data.ingredients.some((line) => line.id && Number(line.amount) > 0);
        if (!hasIngredient) {
            nextErrors.ingredients = 'Selectionne au moins un ingredient avec une quantite.';
        }

        setClientErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateClientSide()) {
            return;
        }

        patch(route('products.update', product.id), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Produit modifie avec succes.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Modifier Produit" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex items-center justify-between">
                    <div />
                    <Button variant="outline" asChild>
                        <Link href={route('products.index')}>
                            <ArrowLeft />
                            Retour
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-slate-200/70 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Infos Produit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Nom</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                                        placeholder="Ex: Burger Maison"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Prix</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                                        placeholder="Ex: 12.90"
                                    />
                                    <InputError message={clientErrors.price || errors.price} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Categorie
                                    </label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir une categorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORY_OPTIONS.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Upload Photo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onPhotoChange}
                                        className="block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#FF7E47]"
                                    />
                                    <InputError message={errors.photo} />
                                </div>
                            </div>

                            {photoPreview ? (
                                <div className="pt-2">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="h-28 w-28 rounded-lg object-cover"
                                    />
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/70 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Recette</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!hasIngredients ? (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    Il n'y a pas encore d'ingredient disponible. Ajoute d'abord des
                                    ingredients dans la page Inventaire.
                                </div>
                            ) : null}

                            <div className="space-y-3">
                                {data.ingredients.map((line, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200/80 p-3 md:grid-cols-[1fr_140px_110px_auto]"
                                    >
                                        {(() => {
                                            const ingredient = ingredientsById.get(String(line.id));
                                            const baseUnit = ingredient?.unit || 'pcs';
                                            const unitOptions = getUnitOptions(baseUnit);
                                            const currentInputUnit =
                                                line.input_unit ||
                                                getPreferredInputUnit(baseUnit);
                                            const deducedBaseValue = line.amount || 0;

                                            return (
                                                <>
                                        <Select
                                            value={line.id ? String(line.id) : ''}
                                            disabled={!hasIngredients}
                                            onValueChange={(value) => handleIngredientChange(index, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un ingredient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hasIngredients ? (
                                                    ingredients.map((ingredient) => (
                                                        <SelectItem
                                                            key={ingredient.id}
                                                            value={String(ingredient.id)}
                                                        >
                                                            {ingredient.name} ({ingredient.unit})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1.5 text-sm text-slate-500">
                                                        Aucun ingredient disponible.
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <input
                                            type="number"
                                            min="0"
                                            step={getInputStep(baseUnit, currentInputUnit)}
                                            disabled={!hasIngredients || !line.id}
                                            value={line.input_amount}
                                            onChange={(e) =>
                                                updateLineWithInputAmount(
                                                    index,
                                                    e.target.value,
                                                    currentInputUnit,
                                                    baseUnit,
                                                )
                                            }
                                            className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                                            placeholder="Quantite"
                                        />

                                        <Select
                                            value={currentInputUnit}
                                            disabled={!hasIngredients || !line.id}
                                            onValueChange={(value) => handleUnitChange(index, value)}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Unite" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {unitOptions.map((option) => (
                                                    <SelectItem key={option} value={String(option)}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeIngredient(index)}
                                            className="h-10"
                                        >
                                            <Trash2 />
                                        </Button>
                                                    <div className="md:col-span-4">
                                                        {line.id && line.input_amount ? (
                                                            <p className="text-xs text-slate-500">
                                                                Stock deduit :{' '}
                                                                {formatAmountDisplay(
                                                                    deducedBaseValue,
                                                                    baseUnit,
                                                                )}{' '}
                                                                {baseUnit}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
                                <p className="text-sm text-slate-600">
                                    Total ingredients utilises: {selectedIngredientsCount}
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addIngredient}
                                    disabled={!hasIngredients}
                                    className="border-[#FF7E47] text-[#FF7E47] hover:bg-orange-50"
                                >
                                    <Plus />
                                    Ajouter ingredient
                                </Button>
                            </div>
                            <InputError message={clientErrors.ingredients || errors.ingredients} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]"
                        >
                            {processing ? 'Traitement...' : 'Mettre a jour le produit'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
