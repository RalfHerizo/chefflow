import { Card, CardContent } from '@/Components/ui/card';

const PRODUCT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%23F1F5F9"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="9">PRD</text></svg>';

/**
 * @param {{ products?: Array<{id: number|string, name: string, image_url?: string|null, quantity: number}> }} props
 */
export default function TopProducts({ products = [] }) {
    const max = Math.max(1, ...products.map((product) => Number(product.quantity || 0)));

    return (
        <Card className="h-full border-slate-200/70 bg-white shadow-sm">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800">Top produits</h3>
                <p className="text-sm text-slate-500">Meilleures ventes</p>

                {products.length === 0 ? (
                    <p className="mt-6 text-sm text-slate-400">
                        Aucune vente pour l'instant.
                    </p>
                ) : (
                    <ol className="mt-5 space-y-4">
                        {products.map((product, index) => (
                            <li key={product.id} className="flex items-center gap-3">
                                <span className="w-4 shrink-0 text-sm font-semibold text-slate-400">
                                    {index + 1}
                                </span>
                                <img
                                    src={product.image_url || PRODUCT_PLACEHOLDER}
                                    alt={product.name}
                                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {product.name}
                                    </p>
                                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                                        <div
                                            className="h-1.5 rounded-full bg-[#FF7E47]"
                                            style={{
                                                width: `${(Number(product.quantity) / max) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className="shrink-0 text-sm font-semibold text-slate-600">
                                    ×{product.quantity}
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </CardContent>
        </Card>
    );
}
