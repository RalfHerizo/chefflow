import { Link } from '@inertiajs/react';
export default function ApplicationLogo(props) {
    return (
            <div className="flex items-center justify-center">
                <Link href="/" className="flex flex-col items-center gap-3 mb-6 group">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl  bg-[#FF7E47] text-lg font-bold text-white shadow-lg shadow-orange-200 hover:-translate-y-1 transition-all">
                        CH
                    </span>
                </Link>
            </div>
    );
}
