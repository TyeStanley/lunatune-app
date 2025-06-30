import { render, screen } from '@testing-library/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Mock the useAuth hook
const mockUseAuth = {
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when loading', () => {
    it('shows loading screen with correct content', () => {
      mockUseAuth.isLoading = true;
      mockUseAuth.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByText('Verifying your access...')).toBeInTheDocument();
      expect(screen.getByText('Please wait while we get everything ready')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('has correct loading screen structure', () => {
      mockUseAuth.isLoading = true;
      mockUseAuth.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      const loadingContainer = screen
        .getByText('Verifying your access...')
        .closest('.relative.flex.min-h-screen.items-center.justify-center');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('shows Moon icon with animation', () => {
      mockUseAuth.isLoading = true;
      mockUseAuth.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      const moonIcon = screen
        .getByText('Verifying your access...')
        .closest('div')
        ?.querySelector('svg');
      expect(moonIcon).toBeInTheDocument();
    });
  });

  describe('when not authenticated', () => {
    it('calls login when not authenticated', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      expect(mockUseAuth.login).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('returns null when not authenticated', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = false;

      const { container } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      // The component should return null, so the container should be empty
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when authenticated', () => {
    it('renders children when authenticated', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockUseAuth.login).not.toHaveBeenCalled();
    });

    it('renders multiple children when authenticated', () => {
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;

      render(
        <ProtectedRoute>
          <div>Child 1</div>
          <div>Child 2</div>
        </ProtectedRoute>,
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('background styling', () => {
    it('has correct background gradients', () => {
      mockUseAuth.isLoading = true;
      mockUseAuth.isAuthenticated = false;

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      const backgroundContainer = screen
        .getByText('Verifying your access...')
        .closest('.bg-background');
      expect(backgroundContainer).toHaveClass('bg-background relative min-h-screen');
    });
  });
});
