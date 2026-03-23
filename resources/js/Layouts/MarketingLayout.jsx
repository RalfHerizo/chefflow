import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function MarketingLayout({ children }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 8);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F4F1] text-slate-900">
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all ${
                    scrolled
                        ? 'bg-white/90 shadow-sm backdrop-blur'
                        : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href={route('welcome')} className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7E47] text-sm font-semibold text-white">
                            CH
                        </span>
                        <div className="leading-tight">
                            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">
                                Chefflow
                            </p>
                            <p className="text-base font-semibold text-slate-800">
                                Restaurant OS
                            </p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                        <a href="#features" className="hover:text-slate-900">
                            Features
                        </a>
                        <a href="#experience" className="hover:text-slate-900">
                            Experience
                        </a>
                        <a href="#faq" className="hover:text-slate-900">
                            FAQ
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('login')}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            Se connecter
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-lg bg-[#FF7E47] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e86f3d]"
                        >
                            Commencer gratuitement 
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-16">{children}</main>
        </div>
    );
}
