import { render, fireEvent, screen } from '@testing-library/react';
import OrdersPos from '../Pages/Orders/Pos';
import { CartProvider } from '../Contexts/CartContext';

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    useForm: () => ({
        post: vi.fn(),
        processing: false,
        setData: vi.fn(),
    }),
}));

vi.mock('@/Layouts/AuthenticatedLayout', () => ({
    default: ({ children }) => <div>{children}</div>,
}));

const toastMock = {
    success: vi.fn(),
    error: vi.fn(),
};

vi.mock('react-hot-toast', () => ({
    default: toastMock,
}));

describe('POS', () => {
    beforeEach(() => {
        toastMock.success.mockClear();
        toastMock.error.mockClear();
        localStorage.clear();
    });

    it('opens product details modal and adds to cart', async () => {
        const products = [
            {
                id: 1,
                name: 'Pizza Test',
                price: 1200,
                image_url: null,
                category: 'Pizza',
                is_active: true,
                ingredients: [
                    { id: 11, name: 'Tomate' },
                    { id: 12, name: 'Mozzarella' },
                ],
            },
        ];

        render(
            <CartProvider>
                <OrdersPos products={products} />
            </CartProvider>,
        );

        const card = screen
            .getByText('Pizza Test')
            .closest('[role="button"]');
        fireEvent.click(card);

        expect(
            await screen.findByText('Ingredients'),
        ).toBeInTheDocument();
        expect(screen.getByText('Tomate')).toBeInTheDocument();
        expect(screen.getByText('Mozzarella')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Ajouter au panier/i }));

        expect(toastMock.success).toHaveBeenCalled();
    });
});
