import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#F8F4F1]">
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[60%] lg:px-12 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                <Link href="/" className="mb-10 flex items-center gap-3 group w-fit">
                    <div className="relative">
                        <div className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:-left-4 group-hover:opacity-100">
                            <ArrowLeft className="h-5 w-5 text-[#FF7E47]" />
                        </div>
                        
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f1a17] text-sm font-bold text-white shadow-lg transition-all group-hover:bg-[#FF7E47] group-hover:scale-105">
                            CH
                        </span>
                    </div>

                    <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 transition-colors group-hover:text-[#FF7E47]">
                        ChefFlow
                    </span>
                </Link>

                    <div className="relative">
                        {children}
                    </div>

                    <p className="mt-12 text-xs font-medium text-slate-400 text-center">
                        © {new Date().getFullYear()} ChefFlow — Le système d'exploitation des restaurateurs.
                    </p>
                </div>
            </div>

            <div className="relative hidden w-[40%] lg:block">
                <div className="absolute inset-0 h-full w-full">
                    <img 
                        src="https://img.freepik.com/photos-premium/cours-cuisine-amis_1249787-40592.jpg?ga=GA1.1.1249139299.1762579352&semt=ais_hybrid&w=740&q=80" 
                        alt="Restaurant ambiance" 
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1f1a17]/40 via-transparent to-[#FF7E47]/20" />
                </div>

                 
            </div>
        </div>
    );
}