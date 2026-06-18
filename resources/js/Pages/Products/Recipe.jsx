import PrintShell from '@/Components/Print/PrintShell';
import { formatIngredientAmountForPreview } from '@/lib/amountConversion';

function formatEuro(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(value || 0));
}

/**
 * @param {{
 *   product: { id: number|string, name: string, category?: string|null, price: number|string, recipe_cost: number|string|null, margin: number|string|null, margin_ratio: number|null, ingredients: Array<{id: number|string, name: string, unit: string, amount: number|string, cost_price: number|string, line_cost: number|string}> },
 *   restaurant: string
 * }} props
 */
export default function ProductRecipe({ product, restaurant }) {
    const foodCostRatio =
        product.recipe_cost != null && Number(product.price) > 0
            ? Math.round((Number(product.recipe_cost) / Number(product.price)) * 100)
            : null;

    return (
        <PrintShell
            title={`Fiche technique — ${product.name}`}
            backHref={route('products.index')}
            backLabel="Retour aux produits"
        >
            <div className="mx-auto max-w-3xl bg-white p-8 text-slate-800 shadow-sm print:max-w-none print:p-0 print:shadow-none">
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF7E47]">
                            Fiche technique
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {product.name}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {product.category || 'Sans catégorie'}
                        </p>
                    </div>
                    <p className="text-sm font-medium text-slate-400">{restaurant}</p>
                </div>

                <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Recette
                </h2>
                <table className="mt-2 w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="py-2 font-medium">Ingrédient</th>
                            <th className="py-2 text-right font-medium">Quantité</th>
                            <th className="py-2 text-right font-medium">Coût unitaire</th>
                            <th className="py-2 text-right font-medium">Coût</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.ingredients.map((ingredient) => {
                            const amount = formatIngredientAmountForPreview(
                                ingredient.amount,
                                ingredient.unit,
                            );

                            return (
                                <tr key={ingredient.id} className="border-b border-slate-100">
                                    <td className="py-2 text-slate-700">{ingredient.name}</td>
                                    <td className="py-2 text-right text-slate-600">
                                        {amount.value} {amount.unit}
                                    </td>
                                    <td className="py-2 text-right text-slate-600">
                                        {Number(ingredient.cost_price) > 0
                                            ? `${formatEuro(ingredient.cost_price)} / ${ingredient.unit}`
                                            : '—'}
                                    </td>
                                    <td className="py-2 text-right text-slate-700">
                                        {formatEuro(ingredient.line_cost)}
                                    </td>
                                </tr>
                            );
                        })}
                        {product.ingredients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-slate-400">
                                    Aucun ingrédient dans la recette.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>

                <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                        <span>Coût matière</span>
                        <span className="font-semibold">
                            {product.recipe_cost != null ? formatEuro(product.recipe_cost) : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Prix de vente</span>
                        <span className="font-semibold">{formatEuro(product.price)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Food cost</span>
                        <span className="font-semibold">
                            {foodCostRatio != null ? `${foodCostRatio}%` : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-emerald-600">
                        <span>Marge</span>
                        <span>
                            {product.margin != null ? formatEuro(product.margin) : '—'}
                            {product.margin_ratio != null ? ` (${product.margin_ratio}%)` : ''}
                        </span>
                    </div>
                </div>
            </div>
        </PrintShell>
    );
}
