import { render, screen, fireEvent } from '@testing-library/react';
import AuthButton from '@/components/auth/AuthButton';

// Mock the useAuth hook
const mockUseAuth = {
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  signOut: jest.fn(),
  user: null as { name: string | null } | null,
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the DropdownMenu component
jest.mock('@/components/ui/DropdownMenu', () => ({
  DropdownMenu: ({
    trigger,
    items,
  }: {
    trigger: React.ReactNode;
    items: Array<{ label: string; onClick: () => void }>;
  }) => (
    <div data-testid="dropdown-menu">
      <div data-testid="dropdown-trigger">{trigger}</div>
      <div data-testid="dropdown-items">
        {items.map((item, index) => (
          <button key={index} data-testid={`dropdown-item-${index}`} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ),
}));

describe('AuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when loading', () => {
    it('shows loading state', () => {
      mockUseAuth.isLoading = true;
      mockUseAuth.isAuthenticated = false;

      render(<AuthButton />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-not-allowed');
    });
  });

  describe('when not authenticated', () => {
    it('shows login button with default text', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.user = null;

      render(<AuthButton />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Log in');
      expect(button).not.toBeDisabled();
    });

    it('shows login button with custom text', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.user = null;

      render(<AuthButton btnText="Sign In" />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Sign In');
    });

    it('calls login function when clicked', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.user = null;

      render(<AuthButton />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockUseAuth.login).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.user = null;

      render(<AuthButton className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('when authenticated', () => {
    it('shows dropdown menu with user name', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { name: 'John Doe' };

      render(<AuthButton />);

      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('John Doe');
    });

    it('shows dropdown menu with "Account" when user has no name', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { name: null };

      render(<AuthButton />);

      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Account');
    });

    it('has correct dropdown menu items', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { name: 'John Doe' };

      render(<AuthButton />);

      expect(screen.getByTestId('dropdown-item-0')).toHaveTextContent('Dashboard');
      expect(screen.getByTestId('dropdown-item-1')).toHaveTextContent('Find Songs');
      expect(screen.getByTestId('dropdown-item-2')).toHaveTextContent('Log out');
    });

    it('navigates to dashboard when dashboard item is clicked', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { name: 'John Doe' };

      render(<AuthButton />);

      const dashboardButton = screen.getByTestId('dropdown-item-0');
      fireEvent.click(dashboardButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('navigates to search when find songs item is clicked', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { name: 'John Doe' };

      render(<AuthButton />);

      const searchButton = screen.getByTestId('dropdown-item-1');
      fireEvent.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith('/search');
    });

    it('calls signOut when log out item is clicked', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = { name: 'John Doe' };

      render(<AuthButton />);

      const logoutButton = screen.getByTestId('dropdown-item-2');
      fireEvent.click(logoutButton);

      expect(mockUseAuth.signOut).toHaveBeenCalledTimes(1);
    });
  });
});
