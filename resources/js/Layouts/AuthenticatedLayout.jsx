import Sidebar from '@/Components/Layout/Sidebar';
import TopHeader from '@/Components/Layout/TopHeader';
import { usePage } from '@inertiajs/react';
import { Toaster, toast as toastApi } from 'react-hot-toast';
import { X } from 'lucide-react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;

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
                                {toast.icon ? <div className="shrink-0">{toast.icon}</div> : null}
                                <div className="text-sm font-medium">{toast.message}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => toastApi.dismiss(toast.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                                aria-label="Fermer la notification"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                }}
            </Toaster>
            <Sidebar />
            <div className="pl-64">
                <TopHeader user={user} />
                <main className="h-[calc(100vh-5rem)] overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
