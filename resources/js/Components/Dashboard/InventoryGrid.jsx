import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';

const INGREDIENT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="%23F3F4F6"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="Arial" font-size="16">Ingredient</text></svg>';

function formatIngredientMeta(ingredient) {
    if (ingredient?.unit_price !== undefined && ingredient?.unit_price !== null) {
        const rawPrice = Number(ingredient.unit_price);
        const normalizedPrice = rawPrice > 10 ? rawPrice / 100 : rawPrice;
        return `${normalizedPrice.toFixed(2)} EUR`;
    }

    if (ingredient?.unit) {
        return `Unite: ${ingredient.unit}`;
    }

    return 'Unite non definie';
}

/**
 * @param {{ ingredients?: Array<{
 * id: number|string,
 * name: string,
 * stock_quantity: number|string,
 * unit?: string,
 * is_low_stock?: boolean,
 * image_url?: string|null,
 * unit_price?: number|string|null
 * }> }} props
 */
export default function InventoryGrid({ ingredients }) {
    if (!ingredients) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Card key={idx} className="overflow-hidden border-slate-200/70 bg-white">
                        <Skeleton className="h-28 w-full rounded-none" />
                        <CardContent className="space-y-3 p-4">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (ingredients.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Aucun ingredient disponible.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ingredients.map((ingredient) => (
                <Card
                    key={ingredient.id}
                    className="overflow-hidden border-slate-200/70 bg-white shadow-sm"
                >
                    <div className="h-28 overflow-hidden bg-slate-100">
                        <img
                            src={ingredient.image_url || INGREDIENT_PLACEHOLDER}
                            alt={ingredient.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h4 className="line-clamp-1 text-base font-semibold text-slate-800">
                                    {ingredient.name}
                                </h4>
                                <p className="text-xs text-slate-500">
                                    {formatIngredientMeta(ingredient)}
                                </p>
                            </div>
                            <Badge
                                className={
                                    ingredient.is_low_stock
                                        ? 'border-transparent bg-red-100 text-red-700'
                                        : 'border-transparent bg-emerald-100 text-emerald-700'
                                }
                            >
                                {ingredient.is_low_stock ? 'Critique' : 'Ok'}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500">Stock disponible</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {Number(ingredient.stock_quantity)}
                            <span className="ml-1 text-sm font-medium text-slate-500">
                                {ingredient.unit || ''}
                            </span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
