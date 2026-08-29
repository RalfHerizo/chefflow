import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { formatAmountDisplay } from '@/lib/amountConversion';

const INGREDIENT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="100%" height="100%" fill="%23F1F5F9"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="9">ING</text></svg>';

/**
 * @param {{ ingredients?: Array<{
 * id: number|string,
 * name: string,
 * stock_quantity: number|string,
 * unit?: string,
 * is_low_stock?: boolean,
 * image_url?: string|null
 * }> }} props
 */
export default function InventoryGrid({ ingredients }) {
    if (!ingredients) {
        return (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Card key={idx} className="border-slate-200/70 bg-white">
                        <CardContent className="flex items-center gap-3 p-3">
                            <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (ingredients.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Aucun ingrédient disponible.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ingredients.map((ingredient) => (
                <Card
                    key={ingredient.id}
                    className="border-slate-200/70 bg-white shadow-sm"
                >
                    <CardContent className="flex items-center gap-3 p-3">
                        <img
                            src={ingredient.image_url || INGREDIENT_PLACEHOLDER}
                            alt={ingredient.name}
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {ingredient.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {formatAmountDisplay(
                                    ingredient.stock_quantity,
                                    ingredient.unit,
                                )}{' '}
                                {ingredient.unit || ''}
                            </p>
                        </div>
                        <Badge
                            className={
                                ingredient.is_low_stock
                                    ? 'border-transparent bg-red-100 text-red-700'
                                    : 'border-transparent bg-emerald-100 text-emerald-700'
                            }
                        >
                            {ingredient.is_low_stock ? 'Critique' : 'Stable'}
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
