import StatCard from '@/Components/Dashboard/StatCard';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Boxes, Percent, PiggyBank, Printer, ReceiptText, ShoppingCart, Wallet } from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const PERIODS = [7, 30, 90];

const CATEGORY_COLORS = [
    '#FF7E47',
    '#38BDF8',
    '#34D399',
    '#F472B6',
    '#FBBF24',
    '#A78BFA',
    '#FB7185',
];

const PRODUCT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="100%" height="100%" fill="%23F1F5F9"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="9">PRD</text></svg>';

function formatEuro(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(value || 0));
}

/**
 * @param {{
 *   period: number,
 *   kpis: { revenue: {value: number, delta: number|null}, orders: {value: number, delta: number|null}, avgBasket: {value: number, delta: number|null}, itemsSold: {value: number, delta: number|null} },
 *   revenueTrend: Array<{date: string, revenue: number}>,
 *   categoryRevenue: Array<{category: string, revenue: number}>,
 *   topProducts: Array<{id: number|string, name: string, image_url?: string|null, quantity: number, revenue: number, cost: number, margin: number, margin_ratio: number|null}>,
 *   topProfitable: Array<{id: number|string, name: string, image_url?: string|null, quantity: number, revenue: number, cost: number, margin: number, margin_ratio: number|null}>,
 *   profitability: { grossMargin: number, foodCostRatio: number|null, totalCost: number }
 * }} props
 */
export default function AnalyticsIndex({
    period,
    kpis,
    revenueTrend,
    categoryRevenue,
    topProducts,
    topProfitable,
    profitability,
}) {
    const changePeriod = (next) => {
        if (next === period) {
            return;
        }

        router.get(
            route('analytics'),
            { period: next },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: [
                    'period',
                    'kpis',
                    'revenueTrend',
                    'categoryRevenue',
                    'topProducts',
                    'topProfitable',
                    'profitability',
                ],
            },
        );
    };

    const maxRevenue = Math.max(
        1,
        ...topProducts.map((product) => Number(product.revenue || 0)),
    );

    const maxMargin = Math.max(
        1,
        ...topProfitable.map((product) => Number(product.margin || 0)),
    );

    return (
        <AuthenticatedLayout>
            <Head title="Analytics" />

            <div className="mx-auto max-w-7xl space-y-6">
                {/* Print-only report header (hidden on screen). */}
                <div className="hidden print:block">
                    <h1 className="text-xl font-bold text-slate-900">Rapport analytics</h1>
                    <p className="text-sm text-slate-500">
                        Période : {period} jours — édité le{' '}
                        {new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-3 print:hidden">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.print()}
                        className="rounded-xl border-slate-200 text-slate-600 hover:border-[#FF7E47] hover:text-[#FF7E47]"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimer / PDF
                    </Button>
                    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                        {PERIODS.map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => changePeriod(value)}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    period === value
                                        ? 'bg-[#FF7E47] text-white'
                                        : 'text-slate-600 hover:bg-orange-50'
                                }`}
                            >
                                {value} jours
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Wallet}
                        label={`CA · ${period} jours`}
                        value={formatEuro(kpis.revenue.value)}
                        delta={kpis.revenue.delta}
                        tone="orange"
                    />
                    <StatCard
                        icon={ReceiptText}
                        label={`Commandes · ${period} jours`}
                        value={kpis.orders.value}
                        delta={kpis.orders.delta}
                        tone="sky"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label="Panier moyen"
                        value={formatEuro(kpis.avgBasket.value)}
                        delta={kpis.avgBasket.delta}
                        tone="emerald"
                    />
                    <StatCard
                        icon={Boxes}
                        label="Articles vendus"
                        value={kpis.itemsSold.value}
                        delta={kpis.itemsSold.delta}
                        tone="orange"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="border-slate-200/70 bg-white shadow-sm lg:col-span-2">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Évolution du chiffre d'affaires
                            </h3>
                            <p className="text-sm text-slate-500">
                                Revenu quotidien sur {period} jours
                            </p>
                            <div className="mt-4 h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={revenueTrend}
                                        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="analyticsRevenue"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop offset="5%" stopColor="#FF7E47" stopOpacity={0.55} />
                                                <stop offset="95%" stopColor="#FF7E47" stopOpacity={0.06} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            minTickGap={24}
                                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                                            tickFormatter={(value) => `${value} €`}
                                            width={56}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatEuro(value), 'Revenu']}
                                            contentStyle={{
                                                borderRadius: '0.75rem',
                                                border: '1px solid #E2E8F0',
                                                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#FF7E47"
                                            strokeWidth={3}
                                            fill="url(#analyticsRevenue)"
                                            activeDot={{ r: 5, fill: '#FF7E47', strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/70 bg-white shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800">
                                CA par catégorie
                            </h3>
                            <p className="text-sm text-slate-500">
                                Répartition des ventes
                            </p>
                            <div className="mt-4 h-72 w-full">
                                {categoryRevenue.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        Aucune vente sur la période.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={categoryRevenue}
                                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
                                            <XAxis
                                                dataKey="category"
                                                axisLine={false}
                                                tickLine={false}
                                                interval={0}
                                                tick={{ fill: '#94A3B8', fontSize: 11 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                                tickFormatter={(value) => `${value} €`}
                                                width={48}
                                            />
                                            <Tooltip
                                                formatter={(value) => [formatEuro(value), 'CA']}
                                                cursor={{ fill: 'rgba(255, 126, 71, 0.08)' }}
                                                contentStyle={{
                                                    borderRadius: '0.75rem',
                                                    border: '1px solid #E2E8F0',
                                                    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                                                }}
                                            />
                                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                                {categoryRevenue.map((entry, index) => (
                                                    <Cell
                                                        key={entry.category}
                                                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-slate-200/70 bg-white shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Top produits
                        </h3>
                        <p className="text-sm text-slate-500">
                            Meilleures ventes par chiffre d'affaires
                        </p>
                        {topProducts.length === 0 ? (
                            <p className="mt-6 text-sm text-slate-400">
                                Aucune vente sur la période.
                            </p>
                        ) : (
                            <ol className="mt-5 space-y-4">
                                {topProducts.map((product, index) => (
                                    <li
                                        key={product.id}
                                        className="flex items-center gap-4"
                                    >
                                        <span className="w-4 shrink-0 text-sm font-semibold text-slate-400">
                                            {index + 1}
                                        </span>
                                        <img
                                            src={product.image_url || PRODUCT_PLACEHOLDER}
                                            alt={product.name}
                                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="truncate text-sm font-medium text-slate-700">
                                                    {product.name}
                                                </p>
                                                <p className="shrink-0 text-sm font-semibold text-slate-800">
                                                    {formatEuro(product.revenue)}
                                                </p>
                                            </div>
                                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                                                <div
                                                    className="h-1.5 rounded-full bg-[#FF7E47]"
                                                    style={{
                                                        width: `${(Number(product.revenue) / maxRevenue) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            {product.margin_ratio != null ? (
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Marge {formatEuro(product.margin)} ·{' '}
                                                    {product.margin_ratio}%
                                                </p>
                                            ) : null}
                                        </div>
                                        <span className="shrink-0 text-xs font-medium text-slate-400">
                                            ×{product.quantity}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="border-slate-200/70 bg-white shadow-sm">
                        <CardContent className="space-y-5 p-6">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Rentabilité
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Marge estimée sur {period} jours
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <PiggyBank className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Marge brute
                                        </p>
                                        <p className="text-xl font-bold text-slate-800">
                                            {formatEuro(profitability.grossMargin)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF7E47]">
                                        <Percent className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Food cost
                                        </p>
                                        <p className="text-xl font-bold text-slate-800">
                                            {profitability.foodCostRatio != null
                                                ? `${profitability.foodCostRatio}%`
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="border-t border-slate-100 pt-3 text-xs text-slate-400">
                                Coût matière total :{' '}
                                {formatEuro(profitability.totalCost)}. Estimé à partir
                                du coût des recettes.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/70 bg-white shadow-sm lg:col-span-2">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Plats les plus rentables
                            </h3>
                            <p className="text-sm text-slate-500">
                                Classés par marge dégagée sur la période
                            </p>
                            {topProfitable.length === 0 ? (
                                <p className="mt-6 text-sm text-slate-400">
                                    Aucune vente sur la période.
                                </p>
                            ) : (
                                <ol className="mt-5 space-y-4">
                                    {topProfitable.map((product, index) => (
                                        <li
                                            key={product.id}
                                            className="flex items-center gap-4"
                                        >
                                            <span className="w-4 shrink-0 text-sm font-semibold text-slate-400">
                                                {index + 1}
                                            </span>
                                            <img
                                                src={product.image_url || PRODUCT_PLACEHOLDER}
                                                alt={product.name}
                                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="truncate text-sm font-medium text-slate-700">
                                                        {product.name}
                                                    </p>
                                                    <p className="shrink-0 text-sm font-semibold text-emerald-600">
                                                        {formatEuro(product.margin)}
                                                    </p>
                                                </div>
                                                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                                                    <div
                                                        className="h-1.5 rounded-full bg-emerald-500"
                                                        style={{
                                                            width: `${(Number(product.margin) / maxMargin) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {product.margin_ratio != null ? (
                                                <span className="shrink-0 text-xs font-medium text-slate-400">
                                                    {product.margin_ratio}%
                                                </span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
