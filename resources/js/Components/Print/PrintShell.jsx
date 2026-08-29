import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

/**
 * Standalone scaffold for print-friendly documents (receipt, recipe sheet).
 * Renders a screen-only toolbar (Retour / Imprimer) above the document; the
 * toolbar is hidden when printing so only the document reaches the page.
 *
 * @param {{ title: string, backHref: string, backLabel?: string, children: React.ReactNode }} props
 */
export default function PrintShell({ title, backHref, backLabel = 'Retour', children }) {
    return (
        <div className="min-h-screen bg-slate-100 py-8 text-slate-800 print:bg-white print:py-0">
            <Head title={title} />

            <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between px-4 print:hidden">
                <Button asChild variant="outline" className="rounded-xl">
                    <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>
                <Button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]"
                >
                    <Printer className="h-4 w-4" />
                    Imprimer / PDF
                </Button>
            </div>

            {children}
        </div>
    );
}
