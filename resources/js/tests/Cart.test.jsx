import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/Contexts/CartContext';

describe('CartContext (public contract)', () => {
    function CartCount() {
        const { cart, totalItems } = useCart();
        return (
            <div>
                <div data-testid="cart-count">{cart.length}</div>
                <div data-testid="total-items">{totalItems}</div>
            </div>
        );
    }

    function AddProductButton() {
        const { addToCart } = useCart();
        return (
            <button
                type="button"
                onClick={() =>
                    addToCart({
                        id: 1,
                        name: 'Pizza',
                        price: 10,
                    })
                }
            >
                Add Product
            </button>
        );
    }

    beforeEach(() => {
        localStorage.removeItem('chefflow_cart');
    });

    it('starts with totalItems at 0', () => {
        render(
            <CartProvider>
                <CartCount />
            </CartProvider>,
        );

        expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    });

    it('increments totalItems when adding a product', async () => {
        const user = userEvent.setup();
        render(
            <CartProvider>
                <CartCount />
                <AddProductButton />
            </CartProvider>,
        );

        expect(screen.getByTestId('total-items')).toHaveTextContent('0');

        await user.click(screen.getByRole('button', { name: 'Add Product' }));

        expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    });
});
