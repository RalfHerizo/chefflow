import { Link } from '@inertiajs/react';

/**
 * Renders the links of a Laravel paginator (serialized by Inertia as an array
 * of { url, label, active }). Returns null when there is a single page.
 *
 * @param {{ links?: Array<{ url: string|null, label: string, active: boolean }>, className?: string }} props
 */
export default function Pagination({ links = [], className = '' }) {
    if (!links || links.length <= 3) {
        return null;
    }

    const toLabel = (raw) =>
        raw
            .replace('&laquo; Previous', 'Précédent')
            .replace('Next &raquo;', 'Suivant');

    return (
        <nav
            className={`flex flex-wrap items-center justify-center gap-1 ${className}`}
        >
            {links.map((link, index) => {
                const html = toLabel(link.label);

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-1.5 text-sm text-slate-300"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            link.active
                                ? 'bg-[#FF7E47] text-white'
                                : 'text-slate-600 hover:bg-orange-50 hover:text-[#FF7E47]'
                        }`}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                );
            })}
        </nav>
    );
}
