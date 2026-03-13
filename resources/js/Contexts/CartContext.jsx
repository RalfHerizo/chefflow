import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

function getInitialCart() {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = localStorage.getItem('chefflow_cart');
        const parsed = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map((item) => {
            const quantity = Number(item?.quantity ?? item?.qty ?? 1);
            const { qty, ...rest } = item ?? {};
            return { ...rest, quantity };
        });
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(getInitialCart);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.setItem('chefflow_cart', JSON.stringify(cart));
        } catch {
            // Ignore write errors (private mode or storage full).
        }
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [...prev, { ...product, quantity: 1 }];
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
                    item.id === productId ? { ...item, quantity } : item,
                )
                .filter((item) => item.quantity > 0),
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
