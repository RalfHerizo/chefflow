import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ingredients}) {

    console.log(ingredients);
    
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
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">État des Stocks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="border p-4 rounded shadow">
                                    <div className="font-bold text-gray-700 uppercase">{ingredient.name}</div>
                                    <div className="text-2xl mt-2">
                                        {parseFloat(ingredient.stock_quantity)} {ingredient.unit}
                                    </div>
                                    {/* Barre de progression visuelle */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            
            

            
        </AuthenticatedLayout>
    );
}
