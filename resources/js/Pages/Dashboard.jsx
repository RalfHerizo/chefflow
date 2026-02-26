import { IngredientCard } from '@/Components/IngredientCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Dashboard({auth,ingredients, products, flash, errors}) {

    // Initialisation du formulaire Inertia
    const { data, setData, post, processing, reset } = useForm({
        product_id: '',
        quantity: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.sell'), {
            onSuccess: () => {
                toast.success('Vente enregistrée !');
                reset(); // On vide le formulaire si ça marche
            },
            onError: (errors) => {
                toast.error(errors.error || 'Stock insuffisant! Erreur lors de la vente');
            }
        });
    };
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                            {
                                flash.message && (
                                    <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                                        {flash.message}
                                    </div>
                                )
                            }

                            {
                                errors.error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" >
                                        { errors.error }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow my-6">
                        <h3 className="font-bold mb-4">Enregistrer une vente</h3>
                        <form onSubmit={submit} className="flex items-end gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Produit</label>
                                <select 
                                    value={data.product_id} 
                                    onChange={e => setData('product_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">Choisir...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantité</label>
                                <input 
                                    type="number" 
                                    value={data.quantity} 
                                    onChange={e => setData('quantity', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Traitement...' : 'Vendre'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">État des Stocks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ingredients.map((ingredient) => (
                                <IngredientCard key={ingredient.id} ingredient={ingredient} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            
            

            
        </AuthenticatedLayout>
    );
}
