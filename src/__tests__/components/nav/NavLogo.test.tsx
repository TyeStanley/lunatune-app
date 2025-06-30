import { render, screen } from '@testing-library/react';
import NavLogo from '@/components/nav/NavLogo';

describe('NavLogo', () => {
  it('renders the logo text', () => {
    render(<NavLogo />);
    expect(screen.getByText(/lunatune/i)).toBeInTheDocument();
  });

  it('renders as a link', () => {
    render(<NavLogo />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
