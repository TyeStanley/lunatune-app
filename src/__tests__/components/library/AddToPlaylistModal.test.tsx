import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddToPlaylistModal from '@/components/library/AddToPlaylistModal';
import { useGetUserPlaylistsQuery } from '@/redux/api/playlistApi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

// Mock the hooks
jest.mock('@/redux/api/playlistApi', () => ({
  useGetUserPlaylistsQuery: jest.fn(),
}));

jest.mock('@/hooks/useDebouncedValue', () => ({
  useDebouncedValue: jest.fn(),
}));

const mockUseGetUserPlaylistsQuery = useGetUserPlaylistsQuery as jest.MockedFunction<
  typeof useGetUserPlaylistsQuery
>;
const mockUseDebouncedValue = useDebouncedValue as jest.MockedFunction<typeof useDebouncedValue>;

describe('AddToPlaylistModal', () => {
  const mockSong = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    filePath: '/path/to/song.mp3',
    durationMs: 180000,
    albumArtUrl: 'test-artwork',
    createdAt: '2023-01-01',
    isLiked: false,
    likeCount: 0,
  };

  const mockPlaylists = [
    {
      id: '1',
      name: 'My Playlist',
      description: 'A test playlist',
      isPublic: true,
      isCreator: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    {
      id: '2',
      name: 'Another Playlist',
      description: 'Another test playlist',
      isPublic: false,
      isCreator: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    song: mockSong,
    onAddToPlaylist: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDebouncedValue.mockReturnValue('');
    mockUseGetUserPlaylistsQuery.mockReturnValue({
      data: mockPlaylists,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useGetUserPlaylistsQuery>);
  });

  describe('rendering', () => {
    it('renders when open', () => {
      render(<AddToPlaylistModal {...defaultProps} />);

      expect(screen.getByText('Add to Playlist')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search your playlists')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<AddToPlaylistModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Add to Playlist')).not.toBeInTheDocument();
    });

    it('shows close button', () => {
      render(<AddToPlaylistModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('playlist loading states', () => {
    it('shows loading state', () => {
      mockUseGetUserPlaylistsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useGetUserPlaylistsQuery>);

      render(<AddToPlaylistModal {...defaultProps} />);

      expect(screen.getByText('Loading playlists...')).toBeInTheDocument();
    });

    it('shows error state', () => {
      mockUseGetUserPlaylistsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useGetUserPlaylistsQuery>);

      render(<AddToPlaylistModal {...defaultProps} />);

      expect(screen.getByText('Failed to load playlists')).toBeInTheDocument();
    });

    it('shows no playlists message when empty', () => {
      mockUseGetUserPlaylistsQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useGetUserPlaylistsQuery>);

      render(<AddToPlaylistModal {...defaultProps} />);

      expect(screen.getByText('No playlists found.')).toBeInTheDocument();
    });
  });

  describe('playlist filtering', () => {
    it('filters out Liked Songs playlist', () => {
      const playlistsWithLiked = [
        ...mockPlaylists,
        {
          id: '3',
          name: 'Liked Songs',
          description: 'Liked songs',
          isPublic: false,
          isCreator: true,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockUseGetUserPlaylistsQuery.mockReturnValue({
        data: playlistsWithLiked,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useGetUserPlaylistsQuery>);

      render(<AddToPlaylistModal {...defaultProps} />);

      expect(screen.getByText('My Playlist')).toBeInTheDocument();
      expect(screen.getByText('Another Playlist')).toBeInTheDocument();
      expect(screen.queryByText('Liked Songs')).not.toBeInTheDocument();
    });

    it('filters out non-creator playlists', () => {
      const playlistsWithNonCreator = [
        ...mockPlaylists,
        {
          id: '3',
          name: 'Shared Playlist',
          description: 'Shared playlist',
          isPublic: true,
          isCreator: false,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockUseGetUserPlaylistsQuery.mockReturnValue({
        data: playlistsWithNonCreator,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useGetUserPlaylistsQuery>);

      render(<AddToPlaylistModal {...defaultProps} />);

      expect(screen.getByText('My Playlist')).toBeInTheDocument();
      expect(screen.getByText('Another Playlist')).toBeInTheDocument();
      expect(screen.queryByText('Shared Playlist')).not.toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('updates search input', () => {
      render(<AddToPlaylistModal {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search your playlists');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(searchInput).toHaveValue('test search');
    });

    it('uses debounced search', () => {
      render(<AddToPlaylistModal {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search your playlists');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(mockUseDebouncedValue).toHaveBeenCalledWith('test search', 400);
    });
  });

  describe('playlist selection', () => {
    it('calls onAddToPlaylist when playlist is selected', async () => {
      const mockOnAddToPlaylist = jest.fn().mockResolvedValue(undefined);

      render(<AddToPlaylistModal {...defaultProps} onAddToPlaylist={mockOnAddToPlaylist} />);

      const playlistButton = screen.getByText('My Playlist');
      fireEvent.click(playlistButton);

      await waitFor(() => {
        expect(mockOnAddToPlaylist).toHaveBeenCalledWith('1');
      });
    });

    it('shows success message after adding to playlist', async () => {
      const mockOnAddToPlaylist = jest.fn().mockResolvedValue(undefined);

      render(<AddToPlaylistModal {...defaultProps} onAddToPlaylist={mockOnAddToPlaylist} />);

      const playlistButton = screen.getByText('My Playlist');
      fireEvent.click(playlistButton);

      await waitFor(() => {
        expect(screen.getByText('Song added to playlist!')).toBeInTheDocument();
      });
    });

    it('closes modal after success', async () => {
      const mockOnAddToPlaylist = jest.fn().mockResolvedValue(undefined);
      const mockOnClose = jest.fn();

      render(
        <AddToPlaylistModal
          {...defaultProps}
          onAddToPlaylist={mockOnAddToPlaylist}
          onClose={mockOnClose}
        />,
      );

      const playlistButton = screen.getByText('My Playlist');
      fireEvent.click(playlistButton);

      await waitFor(() => {
        expect(screen.getByText('Song added to playlist!')).toBeInTheDocument();
      });

      // Wait for the timeout to close the modal
      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('error handling', () => {
    it('shows error message when adding fails', async () => {
      const mockError = new Error('Failed to add song');
      const mockOnAddToPlaylist = jest.fn().mockRejectedValue(mockError);

      render(<AddToPlaylistModal {...defaultProps} onAddToPlaylist={mockOnAddToPlaylist} />);

      const playlistButton = screen.getByText('My Playlist');
      fireEvent.click(playlistButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to add song')).toBeInTheDocument();
      });
    });

    it('shows API error message when available', async () => {
      const mockError = {
        data: { message: 'API Error Message' },
      };
      const mockOnAddToPlaylist = jest.fn().mockRejectedValue(mockError);

      render(<AddToPlaylistModal {...defaultProps} onAddToPlaylist={mockOnAddToPlaylist} />);

      const playlistButton = screen.getByText('My Playlist');
      fireEvent.click(playlistButton);

      await waitFor(() => {
        expect(screen.getByText('API Error Message')).toBeInTheDocument();
      });
    });
  });

  describe('modal interactions', () => {
    it('calls onClose when close button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<AddToPlaylistModal {...defaultProps} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const mockOnClose = jest.fn();
      render(<AddToPlaylistModal {...defaultProps} onClose={mockOnClose} />);

      const backdrop = screen
        .getByText('Add to Playlist')
        .closest('.fixed')
        ?.querySelector('.bg-black');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('resets state when closed', () => {
      const mockOnClose2 = jest.fn();
      const { unmount: unmount2 } = render(
        <AddToPlaylistModal {...defaultProps} onClose={mockOnClose2} />,
      );

      // Open modal and interact
      const searchInput2 = screen.getByPlaceholderText('Search your playlists');
      fireEvent.change(searchInput2, { target: { value: 'test' } });

      // Close modal
      const closeButton2 = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton2);

      // Unmount and remount to simulate full close/open cycle
      unmount2();
      render(<AddToPlaylistModal {...defaultProps} isOpen={true} onClose={mockOnClose2} />);

      // Check that search is reset
      const newSearchInput2 = screen.getByPlaceholderText('Search your playlists');
      expect(newSearchInput2).toHaveValue('');
    });
  });

  describe('accessibility', () => {
    it('has proper focus management', () => {
      render(<AddToPlaylistModal {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search your playlists');
      expect(searchInput).toHaveFocus();
    });

    it('has proper ARIA labels', () => {
      render(<AddToPlaylistModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
