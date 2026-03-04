import Sidebar from '@/Components/Layout/Sidebar';
import TopHeader from '@/Components/Layout/TopHeader';
import { usePage } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-[#F8F4F1] text-slate-800">
            <Toaster position="top-right" />
            <Sidebar />
            <div className="pl-64">
                <TopHeader user={user} />
                <main className="h-[calc(100vh-5rem)] overflow-y-auto p-8">
                    {header ? <div className="mb-6">{header}</div> : null}
                    {children}
                </main>
            </div>
        </div>
    );
}
