import { render, screen } from '@testing-library/react';
import { CartProvider, useCart } from '@/Contexts/CartContext';

describe('CartContext (skeleton)', () => {
    function CartCount() {
        const { cart } = useCart();
        return <div data-testid="cart-count">{cart.length}</div>;
    }

    beforeEach(() => {
        localStorage.removeItem('chefflow_cart');
    });

    it('starts with an empty cart', () => {
        render(
            <CartProvider>
                <CartCount />
            </CartProvider>,
        );

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it.todo('adds a product to the cart (to be completed)');
});
