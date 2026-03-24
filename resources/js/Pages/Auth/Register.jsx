import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Créer un compte" />
            <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-slate-900">Rejoignez la brigade</h2>
                <p className="mt-2 text-sm text-slate-500">Commencez à digitaliser votre service en quelques clics.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nom complet" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="Chef Auguste Escoffier"
                        className="mt-1 block w-full border-slate-200 focus:border-[#FF7E47] focus:ring-[#FF7E47] rounded-xl shadow-sm placeholder:text-slate-300"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Champ Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email professionnel" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="contact@votre-restaurant.com"
                        className="mt-1 block w-full border-slate-200 focus:border-[#FF7E47] focus:ring-[#FF7E47] rounded-xl shadow-sm placeholder:text-slate-300"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Champ Mot de passe */}
                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="mt-1 block w-full border-slate-200 focus:border-[#FF7E47] focus:ring-[#FF7E47] rounded-xl shadow-sm placeholder:text-slate-300"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirmation Mot de passe */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" className="text-slate-700 font-semibold" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="••••••••"
                        className="mt-1 block w-full border-slate-200 focus:border-[#FF7E47] focus:ring-[#FF7E47] rounded-xl shadow-sm placeholder:text-slate-300"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center rounded-xl bg-[#FF7E47] py-3 text-sm font-bold shadow-lg shadow-orange-100 hover:bg-[#e86f3d] active:scale-95 transition-all" 
                        disabled={processing}
                    >
                        Créer mon accès gratuit
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Déjà un compte ?{' '}
                    <Link href={route('login')} className="font-bold text-[#FF7E47] hover:underline">
                        Se connecter
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}