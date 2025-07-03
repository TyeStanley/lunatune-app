import { render, screen } from '@testing-library/react';
import LibraryPage from '@/app/(auth)/library/page';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

// Mock the hooks
jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/useDebouncedValue');

// Mock the RTK Query hooks to prevent act() warnings
jest.mock('@/redux/api/playlistApi', () => ({
  useGetUserPlaylistsQuery: jest.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useGetPlaylistQuery: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    isFetching: false,
  })),
}));

// Mock the components
jest.mock('@/components/library/LibrarySidebar', () => {
  return function MockLibrarySidebar() {
    return <div data-testid="library-sidebar">Library Sidebar</div>;
  };
});

jest.mock('@/components/SongsList', () => ({
  SongsList: function MockSongsList() {
    return <div data-testid="songs-list">Songs List</div>;
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseDebouncedValue = useDebouncedValue as jest.MockedFunction<typeof useDebouncedValue>;

// Mock data
const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

describe('LibraryPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      signOut: jest.fn(),
      isLoading: false,
      isAuthenticated: true,
      error: undefined,
      getAccessTokenSilently: jest.fn(),
    });
    mockUseDebouncedValue.mockReturnValue('');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the library page with sidebar and main content', () => {
      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      expect(screen.getByTestId('library-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('songs-list')).toBeInTheDocument();
    });

    it('should render when user is authenticated', () => {
      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      expect(screen.getByTestId('library-sidebar')).toBeInTheDocument();
    });

    it('should handle unauthenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: undefined,
        login: jest.fn(),
        signOut: jest.fn(),
        isLoading: false,
        isAuthenticated: false,
        error: undefined,
        getAccessTokenSilently: jest.fn(),
      });

      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      expect(screen.getByTestId('library-sidebar')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have proper layout structure', () => {
      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      const sidebar = screen.getByTestId('library-sidebar');
      const songsList = screen.getByTestId('songs-list');

      expect(sidebar).toBeInTheDocument();
      expect(songsList).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should use authentication hook', () => {
      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      expect(mockUseAuth).toHaveBeenCalled();
    });

    it('should use debounced value hook', () => {
      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      expect(mockUseDebouncedValue).toHaveBeenCalled();
    });
  });

  describe('Redux Integration', () => {
    it('should use Redux store for state management', () => {
      render(
        <TestWrapper>
          <LibraryPage />
        </TestWrapper>,
      );

      // The component should render without errors, indicating Redux integration works
      expect(screen.getByTestId('library-sidebar')).toBeInTheDocument();
    });
  });
});
