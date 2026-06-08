import { router, usePage } from '@inertiajs/react';
import { FlaskConical, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function DemoBanner() {
    const { isDemo } = usePage().props;
    const [resetting, setResetting] = useState(false);

    if (!isDemo) {
        return null;
    }

    const reset = () => {
        setResetting(true);
        router.post(
            route('demo.reset'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setResetting(false),
            },
        );
    };

    return (
        <div className="flex items-center justify-between gap-4 bg-[#1f1a17] px-6 py-2 text-sm text-white">
            <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 shrink-0 text-[#FF7E47]" />
                <span>
                    Mode démo — données d'exemple, réinitialisées régulièrement.
                    Explorez librement&nbsp;!
                </span>
            </div>
            <button
                type="button"
                onClick={reset}
                disabled={resetting}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-semibold transition hover:bg-white/20 disabled:opacity-50"
            >
                <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
                Réinitialiser
            </button>
        </div>
    );
}
