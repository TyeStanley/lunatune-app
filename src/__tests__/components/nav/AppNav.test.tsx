import { render, screen } from '@testing-library/react';
import AppNav from '@/components/nav/AppNav';

jest.mock('@/components/auth/AuthButton', () => {
  return function MockAuthButton() {
    return <div data-testid="auth-button">Auth Button</div>;
  };
});

jest.mock('@/components/nav/NavLogo', () => {
  return function MockNavLogo() {
    return <div data-testid="nav-logo">Nav Logo</div>;
  };
});

describe('AppNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation with all components', () => {
    render(<AppNav />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('nav-logo')).toBeInTheDocument();
    expect(screen.getByTestId('auth-button')).toBeInTheDocument();
  });

  it('has correct navigation structure', () => {
    render(<AppNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('border-background-lighter relative z-50 border-b');
  });

  it('has correct layout classes', () => {
    render(<AppNav />);

    const container = screen.getByRole('navigation').querySelector('.mx-auto');
    expect(container).toHaveClass('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
  });

  it('has correct flex layout for main content', () => {
    render(<AppNav />);

    const flexContainer = screen.getByRole('navigation').querySelector('.flex.h-16');
    expect(flexContainer).toHaveClass('flex h-16 items-center justify-between gap-8');
  });

  it('has higher z-index than PublicNav', () => {
    render(<AppNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('z-50');
  });
});
