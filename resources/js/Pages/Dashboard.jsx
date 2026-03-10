import InventoryGrid from '@/Components/Dashboard/InventoryGrid';
import RecentOrdersTable from '@/Components/Dashboard/RecentOrdersTable';
import RevenueChart from '@/Components/Dashboard/RevenueChart';
import ConfirmationDialog from '@/Components/ui/confirmation-dialog';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard({
    ingredients,
    products,
    flash,
    errors,
    orders,
    weeklyRevenue,
}) {
    const [orderToCancel, setOrderToCancel] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        items: [{ id: '', qty: 1 }],
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('products.sell'), {
            onSuccess: () => {
                toast.success('Vente enregistree');
                reset();
            },
            onError: (formErrors) => {
                toast.error(formErrors.error || 'Stock insuffisant');
            },
        });
    };

    const requestCancel = (orderId) => {
        setOrderToCancel(orderId);
    };

    const confirmCancel = () => {
        if (!orderToCancel) {
            return;
        }

        router.delete(route('orders.destroy', orderToCancel), {
            onSuccess: () => toast.success('Commande annulee'),
            onFinish: () => setOrderToCancel(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

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

                <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-800">Enregistrer une vente</h3>
                    <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
                        <div className="min-w-[220px] flex-1">
                            <label className="mb-1 block text-sm font-medium text-slate-600">Produit</label>
                            <select
                                value={data.items[0]?.id || ''}
                                onChange={(e) =>
                                    setData('items', [{ ...data.items[0], id: e.target.value }])
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-[#FF7E47]"
                            >
                                <option value="">Choisir...</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-36">
                            <label className="mb-1 block text-sm font-medium text-slate-600">Quantite</label>
                            <input
                                type="number"
                                min="1"
                                value={data.items[0]?.qty || 1}
                                onChange={(e) =>
                                    setData('items', [
                                        { ...data.items[0], qty: Number(e.target.value) },
                                    ])
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-[#FF7E47]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-xl bg-[#FF7E47] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#e86f3d] disabled:opacity-50"
                        >
                            {processing ? 'Traitement...' : 'Vendre'}
                        </button>
                    </form>
                </section>

                <section className="space-y-3">
                    <RevenueChart data={weeklyRevenue ?? []} />
                </section>

                <section className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
                    <RecentOrdersTable orders={orders} onCancelOrder={requestCancel} />
                </section>

                <section className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800">Inventory Status</h3>
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
                description="Le stock associe sera restaure automatiquement."
                confirmLabel="Annuler la commande"
                destructive
                onConfirm={confirmCancel}
            />
        </AuthenticatedLayout>
    );
}
