import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

const UNIT_OPTIONS = ['kg', 'g', 'L', 'ml', 'pcs'];

/**
 * @param {{
 * data: {name: string, image_url?: string, unit: string, stock_quantity: number|string, alert_threshold: number|string},
 * setData: (key: string, value: string|number) => void,
 * errors: Record<string, string>,
 * processing: boolean,
 * submitLabel?: string,
 * onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
 * }} props
 */
export default function IngredientForm({
    data,
    setData,
    errors,
    processing,
    submitLabel = 'Save',
    onSubmit,
}) {
    const suggestImageFromName = () => {
        if (!data.name?.trim()) {
            return;
        }

        const query = encodeURIComponent(`${data.name},ingredient,food`);
        setData('image_url', `https://source.unsplash.com/featured/?${query}`);
    };

    return (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nom</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                    placeholder="Ex: Tomate"
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">URL image</label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={data.image_url || ''}
                        onChange={(e) => setData('image_url', e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                        placeholder="https://example.com/image.jpg"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={suggestImageFromName}
                        disabled={!data.name?.trim()}
                        className="whitespace-nowrap border-[#FF7E47] text-[#FF7E47] hover:bg-orange-50"
                    >
                        Auto image
                    </Button>
                </div>
                <InputError message={errors.image_url} />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Unite</label>
                <Select value={data.unit} onValueChange={(value) => setData('unit', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir une unite" />
                    </SelectTrigger>
                    <SelectContent>
                        {UNIT_OPTIONS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                                {unit}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.unit} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Stock initial</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.stock_quantity}
                        onChange={(e) => setData('stock_quantity', e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                    />
                    <InputError message={errors.stock_quantity} />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Seuil d'alerte
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.alert_threshold}
                        onChange={(e) => setData('alert_threshold', e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                    />
                    <InputError message={errors.alert_threshold} />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]"
                >
                    {processing ? 'Traitement...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
