import { render, screen } from '@testing-library/react';
import PublicNav from '@/components/nav/PublicNav';

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

jest.mock('@/components/nav/InstallAppButton', () => {
  return function MockInstallAppButton() {
    return <div data-testid="install-app-button">Install App Button</div>;
  };
});

describe('PublicNav', () => {
  it('renders navigation with all components', () => {
    render(<PublicNav />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('nav-logo')).toBeInTheDocument();
    expect(screen.getByTestId('auth-button')).toBeInTheDocument();
    expect(screen.getByTestId('install-app-button')).toBeInTheDocument();
  });

  it('has correct navigation structure', () => {
    render(<PublicNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('border-background-lighter relative border-b');
  });

  it('has correct layout classes', () => {
    render(<PublicNav />);

    const container = screen.getByRole('navigation').querySelector('.mx-auto');
    expect(container).toHaveClass('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8');
  });

  it('has correct flex layout for main content', () => {
    render(<PublicNav />);

    const flexContainer = screen.getByRole('navigation').querySelector('.flex.h-16');
    expect(flexContainer).toHaveClass('flex h-16 items-center justify-between');
  });

  it('has different z-index than AppNav', () => {
    render(<PublicNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).not.toHaveClass('z-50');
  });
});
