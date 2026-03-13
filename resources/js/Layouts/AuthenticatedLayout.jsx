import Sidebar from '@/Components/Layout/Sidebar';
import TopHeader from '@/Components/Layout/TopHeader';
import { usePage } from '@inertiajs/react';
import { ToastBar, Toaster } from 'react-hot-toast';

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
                                <ToastBar toast={toast}>
                                    {({ icon, message }) => (
                                        <>
                                            <div className="shrink-0">{icon}</div>
                                            <div className="text-sm font-medium">{message}</div>
                                        </>
                                    )}
                                </ToastBar>
                            </div>
                            <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                                Undo
                            </span>
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
