import Sidebar from '@/Components/Layout/Sidebar';
import TopHeader from '@/Components/Layout/TopHeader';
import DemoBanner from '@/Components/DemoBanner';
import { usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function AuthenticatedLayout({ children }) {
    const { auth, isDemo } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-[#F8F4F1] text-slate-800">
            <Toaster position="top-center" gutter={12}>
                {(toast) => {
                    const baseClasses =
                        'pointer-events-auto w-full max-w-xl rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between gap-4';
                    const toneClasses =
                        toast.type === 'error'
                            ? 'bg-red-600 text-white'
                            : toast.type === 'success'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-white';

                    return (
                        <div
                            className={`${baseClasses} ${toneClasses} animate-in slide-in-from-top-2 fade-in`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                    {toast.type === 'success' ? (
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    ) : toast.type === 'error' ? (
                                        <AlertTriangle className="h-5 w-5 text-white" />
                                    ) : (
                                        <Info className="h-5 w-5 text-white" />
                                    )}
                                </div>
                                <div className="text-sm font-medium">{toast.message}</div>
                            </div>
                        </div>
                    );
                }}
            </Toaster>
            <DemoBanner />
            <Sidebar offsetForBanner={isDemo} />
            <div className={`pl-64 ${isDemo ? 'pt-10' : ''}`}>
                <TopHeader user={user} />
                <main
                    className={`overflow-y-auto p-8 ${
                        isDemo
                            ? 'h-[calc(100vh-5rem-2.5rem)]'
                            : 'h-[calc(100vh-5rem)]'
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
