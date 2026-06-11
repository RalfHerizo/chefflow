import { formatAmountDisplay } from '@/lib/amountConversion';
import { Link } from '@inertiajs/react';
import { ArrowRight, TriangleAlert } from 'lucide-react';

const INGREDIENT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="100%" height="100%" fill="%23F1F5F9"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="9">ING</text></svg>';

/**
 * @param {{ ingredients?: Array<{
 * id: number|string,
 * name: string,
 * stock_quantity: number|string,
 * alert_threshold: number|string,
 * unit?: string,
 * image_url?: string|null
 * }>, showManageLink?: boolean }} props
 */
export default function LowStockAlerts({ ingredients = [], showManageLink = true }) {
    if (!ingredients.length) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <TriangleAlert className="h-5 w-5" />
                    </span>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800">
                            À réapprovisionner
                        </h3>
                        <p className="text-xs text-slate-500">
                            {ingredients.length} ingrédient(s) sous le seuil d'alerte.
                        </p>
                    </div>
                </div>
                {showManageLink ? (
                    <Link
                        href={route('ingredients.index')}
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#FF7E47] hover:underline"
                    >
                        Gérer les stocks
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {ingredients.map((ingredient) => (
                    <div
                        key={ingredient.id}
                        className="flex items-center gap-3 rounded-xl border border-red-100 bg-white p-3"
                    >
                        <img
                            src={ingredient.image_url || INGREDIENT_PLACEHOLDER}
                            alt={ingredient.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {ingredient.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                Reste{' '}
                                <span className="font-semibold text-red-600">
                                    {formatAmountDisplay(
                                        ingredient.stock_quantity,
                                        ingredient.unit,
                                    )}{' '}
                                    {ingredient.unit || ''}
                                </span>{' '}
                                · seuil{' '}
                                {formatAmountDisplay(
                                    ingredient.alert_threshold,
                                    ingredient.unit,
                                )}{' '}
                                {ingredient.unit || ''}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
