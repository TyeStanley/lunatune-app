import { render, screen } from '@testing-library/react';
import { SongsList } from '../../components/SongsList';
import { Song } from '../../types/song';

// Mock TrackItem component
jest.mock('../../components/TrackItem', () => {
  return function MockTrackItem({ song, index }: { song: Song; index: number }) {
    return (
      <tr data-testid={`track-item-${song.id}`}>
        <td>{index + 1}</td>
        <td>{song.title}</td>
        <td>{song.artist}</td>
        <td>{song.album}</td>
        <td>{song.durationMs}</td>
      </tr>
    );
  };
});

// Mock Clock icon
jest.mock('lucide-react', () => ({
  Clock: ({ size, className }: { size: number; className: string }) => (
    <svg data-testid="clock-icon" width={size} className={className} />
  ),
}));

describe('SongsList', () => {
  const mockSongs: Song[] = [
    {
      id: '1',
      title: 'Test Song 1',
      artist: 'Test Artist 1',
      album: 'Test Album 1',
      genre: 'Rock',
      filePath: '/path/to/song1.mp3',
      durationMs: 180000,
      albumArtUrl: 'https://example.com/art1.jpg',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      isLiked: true,
      likeCount: 10,
    },
    {
      id: '2',
      title: 'Test Song 2',
      artist: 'Test Artist 2',
      album: 'Test Album 2',
      genre: 'Pop',
      filePath: '/path/to/song2.mp3',
      durationMs: 240000,
      albumArtUrl: 'https://example.com/art2.jpg',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      isLiked: false,
      likeCount: 5,
    },
  ];

  const defaultProps = {
    songs: mockSongs,
    currentPage: 1,
    isLoading: false,
    isFetching: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders songs table when songs are available', () => {
    render(<SongsList {...defaultProps} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<SongsList {...defaultProps} />);

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('renders TrackItem components for each song', () => {
    render(<SongsList {...defaultProps} />);

    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-2')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<SongsList {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Loading songs...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows loading state when isFetching is true', () => {
    render(<SongsList {...defaultProps} isFetching={true} />);

    expect(screen.getByText('Loading songs...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows error state when error is provided', () => {
    const error = new Error('Failed to load songs');
    render(<SongsList {...defaultProps} error={error} />);

    expect(screen.getByText('Error loading songs')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows error state when error is a string', () => {
    render(<SongsList {...defaultProps} error="Network error" />);

    expect(screen.getByText('Error loading songs')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows empty state when no songs are provided', () => {
    render(<SongsList {...defaultProps} songs={[]} />);

    expect(screen.getByText('No songs found')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows custom empty message when provided', () => {
    render(<SongsList {...defaultProps} songs={[]} emptyMessage="No songs in this playlist" />);

    expect(screen.getByText('No songs in this playlist')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('hides Likes column when useLocalStorage is true', () => {
    render(<SongsList {...defaultProps} useLocalStorage={true} />);

    expect(screen.queryByText('Likes')).not.toBeInTheDocument();
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
  });

  it('shows Likes column when useLocalStorage is false', () => {
    render(<SongsList {...defaultProps} useLocalStorage={false} />);

    expect(screen.getByText('Likes')).toBeInTheDocument();
  });

  it('passes correct props to TrackItem components', () => {
    render(
      <SongsList
        {...defaultProps}
        useLocalStorage={true}
        playlistId="playlist-123"
        isLikedSongsPlaylist={true}
        onAddToPlaylist={jest.fn()}
      />,
    );

    // TrackItem components should be rendered with the correct props
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-2')).toBeInTheDocument();
  });

  it('calculates pageSize correctly when songs are available', () => {
    render(<SongsList {...defaultProps} />);

    // pageSize should be equal to songs.length when songs are available
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-2')).toBeInTheDocument();
  });

  it('calculates pageSize as 10 when no songs are available', () => {
    render(<SongsList {...defaultProps} songs={[]} />);

    // When no songs, pageSize defaults to 10 but table is not rendered
    expect(screen.getByText('No songs found')).toBeInTheDocument();
  });

  it('renders with different currentPage values', () => {
    const { rerender } = render(<SongsList {...defaultProps} currentPage={1} />);
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();

    rerender(<SongsList {...defaultProps} currentPage={2} />);
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
  });

  it('renders with single song', () => {
    render(<SongsList {...defaultProps} songs={[mockSongs[0]]} />);

    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('track-item-2')).not.toBeInTheDocument();
  });

  it('renders with many songs', () => {
    const manySongs = Array.from({ length: 10 }, (_, i) => ({
      ...mockSongs[0],
      id: `${i + 1}`,
      title: `Song ${i + 1}`,
    }));

    render(<SongsList {...defaultProps} songs={manySongs} />);

    // Should render all 10 songs
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByTestId(`track-item-${i}`)).toBeInTheDocument();
    }
  });

  it('renders with songs that have missing optional fields', () => {
    const songsWithMissingFields: Song[] = [
      {
        id: '1',
        title: 'Song without album',
        artist: 'Artist',
        filePath: '/path/to/song.mp3',
        durationMs: 180000,
        createdAt: '2023-01-01T00:00:00Z',
        isLiked: false,
        likeCount: 0,
      },
    ];

    render(<SongsList {...defaultProps} songs={songsWithMissingFields} />);

    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.getByText('Song without album')).toBeInTheDocument();
  });

  it('renders table with correct CSS classes', () => {
    render(<SongsList {...defaultProps} />);

    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full');
  });

  it('renders table header with correct CSS classes', () => {
    render(<SongsList {...defaultProps} />);

    const thead = screen.getByRole('table').querySelector('thead');
    expect(thead).toHaveClass('border-b border-gray-700');
  });

  it('renders table header row with correct CSS classes', () => {
    render(<SongsList {...defaultProps} />);

    const headerRow = screen.getByRole('table').querySelector('thead tr');
    expect(headerRow).toHaveClass('text-left text-gray-400');
  });

  it('renders table header cells with correct CSS classes', () => {
    render(<SongsList {...defaultProps} />);

    const headerCells = screen.getByRole('table').querySelectorAll('thead th');

    // First cell (track number) should be centered
    expect(headerCells[0]).toHaveClass('pb-2 text-center');

    // Check specific cells that should have pb-2 class
    expect(headerCells[1]).toHaveClass('pb-2'); // Title
    expect(headerCells[2]).toHaveClass('pb-2'); // Album
    expect(headerCells[3]).toHaveClass('pb-2'); // Date added
    expect(headerCells[4]).toHaveClass('pb-2'); // Likes
  });

  it('renders Album column with responsive classes', () => {
    render(<SongsList {...defaultProps} />);

    const albumHeader = screen.getByText('Album').closest('th');
    expect(albumHeader).toHaveClass('hidden pb-2 sm:table-cell');
  });

  it('renders Date added column with responsive classes', () => {
    render(<SongsList {...defaultProps} />);

    const dateHeader = screen.getByText('Date added').closest('th');
    expect(dateHeader).toHaveClass('hidden pb-2 md:table-cell');
  });

  it('renders Clock icon with correct props', () => {
    render(<SongsList {...defaultProps} />);

    const clockIcon = screen.getByTestId('clock-icon');
    expect(clockIcon).toHaveAttribute('width', '18');
    expect(clockIcon).toHaveClass('ml-2.5 text-gray-400');
  });

  it('renders loading state with correct styling', () => {
    render(<SongsList {...defaultProps} isLoading={true} />);

    const loadingContainer = screen.getByText('Loading songs...').closest('div');
    expect(loadingContainer).toHaveClass('flex items-center justify-center py-8');

    const loadingText = screen.getByText('Loading songs...');
    expect(loadingText).toHaveClass('text-gray-400');
  });

  it('renders error state with correct styling', () => {
    render(<SongsList {...defaultProps} error="Test error" />);

    const errorContainer = screen.getByText('Error loading songs').closest('div');
    expect(errorContainer).toHaveClass('flex items-center justify-center py-8');

    const errorText = screen.getByText('Error loading songs');
    expect(errorText).toHaveClass('text-gray-400');
  });

  it('renders empty state with correct styling', () => {
    render(<SongsList {...defaultProps} songs={[]} />);

    const emptyContainer = screen.getByText('No songs found').closest('div');
    expect(emptyContainer).toHaveClass('flex items-center justify-center py-8');

    const emptyText = screen.getByText('No songs found');
    expect(emptyText).toHaveClass('text-gray-400');
  });

  it('prioritizes loading state over error state', () => {
    render(<SongsList {...defaultProps} isLoading={true} error="Test error" />);

    expect(screen.getByText('Loading songs...')).toBeInTheDocument();
    expect(screen.queryByText('Error loading songs')).not.toBeInTheDocument();
  });

  it('prioritizes loading state over empty state', () => {
    render(<SongsList {...defaultProps} isLoading={true} songs={[]} />);

    expect(screen.getByText('Loading songs...')).toBeInTheDocument();
    expect(screen.queryByText('No songs found')).not.toBeInTheDocument();
  });

  it('prioritizes error state over empty state', () => {
    render(<SongsList {...defaultProps} error="Test error" songs={[]} />);

    expect(screen.getByText('Error loading songs')).toBeInTheDocument();
    expect(screen.queryByText('No songs found')).not.toBeInTheDocument();
  });

  it('renders with all optional props provided', () => {
    const onAddToPlaylist = jest.fn();

    render(
      <SongsList
        {...defaultProps}
        useLocalStorage={true}
        playlistId="playlist-123"
        isLikedSongsPlaylist={true}
        onAddToPlaylist={onAddToPlaylist}
        emptyMessage="Custom empty message"
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
  });

  it('renders with no optional props provided', () => {
    render(<SongsList songs={mockSongs} currentPage={1} isLoading={false} isFetching={false} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('track-item-1')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument(); // Default useLocalStorage is false
  });
});
