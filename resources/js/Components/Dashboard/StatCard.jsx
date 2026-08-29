import { Link } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TONES = {
    orange: 'bg-orange-50 text-[#FF7E47]',
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
};

/**
 * @param {{ icon: Function, label: string, value: string|number, delta?: number|null, tone?: 'orange'|'sky'|'emerald'|'red', href?: string }} props
 */
export default function StatCard({
    icon: Icon,
    label,
    value,
    delta = null,
    tone = 'orange',
    href,
}) {
    const body = (
        <>
            <div className="flex items-start justify-between">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${TONES[tone] ?? TONES.orange}`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                {typeof delta === 'number' ? (
                    <span
                        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            delta >= 0
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                        }`}
                    >
                        {delta >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                        ) : (
                            <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(delta)}%
                    </span>
                ) : null}
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                {value}
            </p>
            <p className="text-sm text-slate-500">{label}</p>
        </>
    );

    const className =
        'block rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md';

    if (href) {
        return (
            <Link href={href} className={className}>
                {body}
            </Link>
        );
    }

    return <div className={className}>{body}</div>;
}
