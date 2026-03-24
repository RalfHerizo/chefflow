import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="mb-8 text-center">
                
                <h2 className="text-xl font-bold text-slate-900">Heureux de vous revoir</h2>
                <p className="mt-2 text-sm text-slate-500">Entrez vos accès pour gérer votre service</p>
            </div>

            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email professionnel" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="chef@votre-restaurant.com"
                        value={data.email}
                        className="mt-1 block w-full border-slate-200 focus:border-[#FF7E47] focus:ring-[#FF7E47] rounded-xl shadow-sm"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Mot de passe" className="text-slate-700 font-semibold"  />
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-xs font-medium text-[#FF7E47] hover:underline">
                                Oublié ?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        placeholder="*********"
                        className="mt-1 block w-full border-slate-200 focus:border-[#FF7E47] focus:ring-[#FF7E47] rounded-xl shadow-sm"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    <span className="ms-2 text-sm text-slate-500">Se souvenir de moi</span>
                </div>

                <PrimaryButton 
                    className="w-full justify-center rounded-xl bg-[#FF7E47] py-3 text-sm font-bold shadow-lg shadow-orange-100 hover:bg-[#e86f3d] active:scale-95 transition-all" 
                    disabled={processing}
                >
                    Se connecter
                </PrimaryButton>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Pas encore de compte ?{' '}
                    <Link href={route('register')} className="font-bold text-[#FF7E47] hover:underline">
                        Créer un accès gratuit
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
