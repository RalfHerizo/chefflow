import PrintShell from '@/Components/Print/PrintShell';

function formatEuroFromCents(cents) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(cents || 0) / 100);
}

function formatEuro(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(value || 0));
}

/**
 * @param {{
 *   order: { id: number|string, created_at: string, total_price: number, items: Array<{name: string, quantity: number, price_at_sale: number|string}> },
 *   restaurant: string
 * }} props
 */
export default function OrderReceipt({ order, restaurant }) {
    // total_price is stored HT (in cents); the till adds 20 % VAT — mirror it.
    const vatRate = 0.2;
    const totalHtCents = Number(order.total_price || 0);
    const totalTtcCents = Math.round(totalHtCents * (1 + vatRate));
    const vatCents = totalTtcCents - totalHtCents;

    const createdAt = order.created_at
        ? new Date(order.created_at).toLocaleString('fr-FR', {
              dateStyle: 'short',
              timeStyle: 'short',
          })
        : '';

    return (
        <PrintShell
            title={`Ticket #${order.id}`}
            backHref={route('orders.index')}
            backLabel="Retour aux commandes"
        >
            <div className="mx-auto max-w-sm bg-white p-6 font-mono text-sm text-slate-800 shadow-sm print:max-w-none print:p-0 print:shadow-none">
                <div className="text-center">
                    <p className="text-base font-bold uppercase tracking-wide">{restaurant}</p>
                    <p className="text-xs text-slate-500">Ticket de caisse</p>
                </div>

                <div className="mt-4 flex justify-between text-xs text-slate-500">
                    <span>Commande #{order.id}</span>
                    <span>{createdAt}</span>
                </div>

                <div className="my-3 border-t border-dashed border-slate-300" />

                <table className="w-full">
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index} className="align-top">
                                <td className="py-1 pr-2">
                                    {item.name}
                                    <span className="text-slate-400">
                                        {' '}
                                        ×{item.quantity}
                                    </span>
                                </td>
                                <td className="py-1 text-right whitespace-nowrap">
                                    {formatEuro(Number(item.price_at_sale) * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="my-3 border-t border-dashed border-slate-300" />

                <div className="space-y-1">
                    <div className="flex justify-between text-slate-600">
                        <span>Total HT</span>
                        <span>{formatEuroFromCents(totalHtCents)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>TVA ({Math.round(vatRate * 100)}%)</span>
                        <span>{formatEuroFromCents(vatCents)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                        <span>Total TTC</span>
                        <span>{formatEuroFromCents(totalTtcCents)}</span>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Merci de votre visite !
                </p>
            </div>
        </PrintShell>
    );
}
