import { render, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../Contexts/CartContext';

function TestComponent() {
    const { addToCart } = useCart();
    return (
        <button
            type="button"
            onClick={() =>
                addToCart({ id: 1, name: 'Pizza', price: 1200 })
            }
        >
            Add
        </button>
    );
}

describe('CartContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('adds a new product with quantity 1', async () => {
        const { getByText } = render(
            <CartProvider>
                <TestComponent />
            </CartProvider>,
        );

        fireEvent.click(getByText('Add'));

        await waitFor(() => {
            const stored = JSON.parse(localStorage.getItem('chefflow_cart'));
            expect(stored).toHaveLength(1);
            expect(stored[0].id).toBe(1);
            expect(stored[0].quantity).toBe(1);
        });
    });

    it('increments quantity when same product is added twice', async () => {
        const { getByText } = render(
            <CartProvider>
                <TestComponent />
            </CartProvider>,
        );

        fireEvent.click(getByText('Add'));
        fireEvent.click(getByText('Add'));

        await waitFor(() => {
            const stored = JSON.parse(localStorage.getItem('chefflow_cart'));
            expect(stored).toHaveLength(1);
            expect(stored[0].id).toBe(1);
            expect(stored[0].quantity).toBe(2);
        });
    });
});
