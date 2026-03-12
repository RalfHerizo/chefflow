import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

/**
 * @param {{ products: Array<{id: number|string, name: string, price: number, image_url?: string|null, category?: string|null, is_active: boolean}> }} props
 */
export default function OrdersPos({ products }) {
    return (
        <AuthenticatedLayout>
            <Head title="Caisse" />

            <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800">Caisse</h2>
                    <p className="text-sm text-slate-500">
                        Interface de prise de commande en cours de construction.
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                        Produits chargÃ©s: {products.length}
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
