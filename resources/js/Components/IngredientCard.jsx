export const IngredientCard = ({ingredient}) => {
    return (
        <div
            key={ingredient.id}
            className={`border-2 p-4 rounded-xl shadow-sm transition-all ${
                ingredient.is_low_stock
                    ? "border-red-500 bg-red-50 shadow-red-100"
                    : "border-white bg-white"
            }`}
        >
            <div className="flex justify-between items-start">
                <span className="font-bold text-gray-700 uppercase">
                    {ingredient.name}
                </span>
                {ingredient.is_low_stock && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">
                        STOCK FAIBLE
                    </span>
                )}
            </div>

            <div
                className={`text-2xl mt-2 font-black ${
                    ingredient.is_low_stock ? "text-red-600" : "text-blue-600"
                }`}
            >
                {parseFloat(ingredient.stock_quantity)}{" "}
                <span className="text-sm font-normal text-gray-500">
                    {ingredient.unit}
                </span>
            </div>

            {/* Un petit texte pour aider le restaurateur */}
            <div className="text-xs text-gray-400 mt-1">
                Seuil d'alerte : {ingredient.alert_threshold} {ingredient.unit}
            </div>
        </div>
    );
};
