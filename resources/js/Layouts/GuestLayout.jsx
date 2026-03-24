export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#F8F4F1] px-6 pt-6 sm:justify-center sm:pt-0">
            <div className="w-full sm:max-w-md"> 
 
                <div className="relative overflow-hidden rounded-[32px] border border-white bg-white/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-10">

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-100/50 blur-3xl" />
                    
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
                
                <p className="mt-8 text-center text-xs font-medium text-slate-400">
                    © {new Date().getFullYear()} ChefFlow — Restaurant OS
                </p>
            </div>
        </div>
    );
}
