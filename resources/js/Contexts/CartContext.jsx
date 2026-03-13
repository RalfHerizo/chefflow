import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

function getInitialCart() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = localStorage.getItem('chefflow_cart');
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(getInitialCart);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (productId, quantity) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === productId ? { ...item, qty: quantity } : item,
                )
                .filter((item) => item.qty > 0),
        );
    };

    const value = useMemo(
        () => ({
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
        }),
        [cart],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
