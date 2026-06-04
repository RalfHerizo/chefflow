import { render, screen } from '@testing-library/react';
import MarketingLayout from '@/Layouts/MarketingLayout';

const mockUsePage = vi.fn();

vi.mock('@inertiajs/react', () => ({
    usePage: () => mockUsePage(),
    Link: ({ href, children, className, onClick }) => (
        <a href={href} className={className} onClick={onClick}>
            {children}
        </a>
    ),
}));

beforeAll(() => {
    globalThis.route = (name) => `/${name}`;
});

describe('MarketingLayout — auth-aware CTAs', () => {
    it('shows Se connecter + Essai gratuit for guests', () => {
        mockUsePage.mockReturnValue({ props: { auth: { user: null } } });

        render(<MarketingLayout>contenu</MarketingLayout>);

        expect(screen.getAllByText('Se connecter').length).toBeGreaterThan(0);
        expect(screen.getByText('Essai gratuit')).toBeInTheDocument();
        expect(screen.getByText('Commencer gratuitement')).toBeInTheDocument();
        expect(screen.queryByText('Tableau de bord')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Accéder au tableau de bord'),
        ).not.toBeInTheDocument();
    });

    it('shows dashboard CTA and hides login/register when authenticated', () => {
        mockUsePage.mockReturnValue({
            props: { auth: { user: { id: 1, name: 'Ralf' } } },
        });

        render(<MarketingLayout>contenu</MarketingLayout>);

        expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
        expect(
            screen.getByText('Accéder au tableau de bord'),
        ).toBeInTheDocument();
        expect(screen.queryByText('Se connecter')).not.toBeInTheDocument();
        expect(screen.queryByText('Essai gratuit')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Commencer gratuitement'),
        ).not.toBeInTheDocument();
    });
});
