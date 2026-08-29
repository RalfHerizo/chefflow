import InventoryGrid from '@/Components/Dashboard/InventoryGrid';
import LowStockAlerts from '@/Components/Dashboard/LowStockAlerts';
import RecentOrdersTable from '@/Components/Dashboard/RecentOrdersTable';
import RevenueChart from '@/Components/Dashboard/RevenueChart';
import StatCard from '@/Components/Dashboard/StatCard';
import TopProducts from '@/Components/Dashboard/TopProducts';
import ConfirmationDialog from '@/Components/ui/confirmation-dialog';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Plus,
    ReceiptText,
    ShoppingCart,
    TriangleAlert,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function formatEuro(cents) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(cents || 0) / 100);
}

export default function Dashboard({
    stats,
    weeklyRevenue,
    topProducts,
    orders,
    ingredients,
    lowStockIngredients,
    flash,
    errors,
}) {
    const lowStockCount = usePage().props.lowStockCount ?? 0;
    const [orderToCancel, setOrderToCancel] = useState(null);

    const confirmCancel = () => {
        if (!orderToCancel) {
            return;
        }

        router.delete(route('orders.destroy', orderToCancel), {
            onSuccess: () => toast.success('Commande annulée'),
            onFinish: () => setOrderToCancel(null),
        });
    };

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <AuthenticatedLayout>
            <Head title="Tableau de bord" />

            <div className="mx-auto max-w-7xl space-y-6">
                {flash?.message ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {flash.message}
                    </div>
                ) : null}

                {errors?.error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errors.error}
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500 first-letter:uppercase">
                        {today}
                    </p>
                    <Link
                        href={route('orders.pos')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7E47] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e86f3d]"
                    >
                        <Plus className="h-4 w-4" />
                        Nouvelle commande
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Wallet}
                        label="CA · 7 jours"
                        value={formatEuro(stats.revenue.value)}
                        delta={stats.revenue.delta}
                        tone="orange"
                    />
                    <StatCard
                        icon={ReceiptText}
                        label="Commandes · 7 jours"
                        value={stats.orders.value}
                        delta={stats.orders.delta}
                        tone="sky"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label="Panier moyen"
                        value={formatEuro(stats.avgBasket.value)}
                        delta={stats.avgBasket.delta}
                        tone="emerald"
                    />
                    <StatCard
                        icon={TriangleAlert}
                        label="Stock critique"
                        value={stats.lowStock.value}
                        tone="red"
                        href={route('ingredients.index')}
                    />
                </div>

                {lowStockIngredients?.length > 0 ? (
                    <LowStockAlerts
                        ingredients={lowStockIngredients}
                        totalCount={lowStockCount}
                    />
                ) : null}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RevenueChart
                            data={weeklyRevenue ?? []}
                            total={stats.revenue.value}
                        />
                    </div>
                    <div>
                        <TopProducts products={topProducts ?? []} />
                    </div>
                </div>

                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Commandes récentes
                        </h3>
                        <Link
                            href={route('orders.index')}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF7E47] hover:underline"
                        >
                            Voir tout
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <RecentOrdersTable orders={orders} onCancelOrder={setOrderToCancel} />
                </section>

                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            État des stocks
                        </h3>
                        <Link
                            href={route('ingredients.index')}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF7E47] hover:underline"
                        >
                            Voir tout
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <InventoryGrid ingredients={ingredients} />
                </section>
            </div>

            <ConfirmationDialog
                open={Boolean(orderToCancel)}
                onOpenChange={(open) => {
                    if (!open) {
                        setOrderToCancel(null);
                    }
                }}
                title="Annuler cette commande ?"
                description="Le stock associé sera restauré automatiquement."
                confirmLabel="Annuler la commande"
                destructive
                onConfirm={confirmCancel}
            />
        </AuthenticatedLayout>
    );
}
