import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TrackItem from '../../components/TrackItem';
import { Song } from '../../types/song';
import playbackControlsReducer from '../../redux/state/playback-controls/playbackControlsSlice';
import queueReducer from '../../redux/state/queue/queueSlice';
import userReducer from '../../redux/state/user/userSlice';
import type { PlaybackControlsState } from '../../redux/state/playback-controls/playbackControlsSlice';
import type { UserState } from '../../redux/state/user/userSlice';

// Mock the Redux API hooks
jest.mock('../../redux/api/songApi', () => ({
  useLikeSongMutation: () => [jest.fn().mockResolvedValue({ data: {} }), { isLoading: false }],
  useUnlikeSongMutation: () => [jest.fn().mockResolvedValue({ data: {} }), { isLoading: false }],
}));

jest.mock('../../redux/api/playlistApi', () => ({
  useAddSongToPlaylistMutation: () => [
    jest.fn().mockResolvedValue({ data: {} }),
    { isLoading: false },
  ],
  useRemoveSongFromPlaylistMutation: () => [
    jest.fn().mockResolvedValue({ data: {} }),
    { isLoading: false },
  ],
}));

// Mock utility functions
jest.mock('../../lib/utils/date', () => ({
  getRelativeTime: jest.fn(() => '2 days ago'),
}));

jest.mock('../../lib/utils/duration', () => ({
  formatDuration: jest.fn(() => '3:00'),
}));

// Mock DropdownMenu component
jest.mock('../../components/ui/DropdownMenu', () => ({
  DropdownMenu: ({ items }: { items: Array<{ label: string; onClick: () => void }> }) => (
    <div data-testid="dropdown-menu">
      {items.map((item, index) => (
        <button
          key={index}
          data-testid={`dropdown-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Play: ({ size }: { size: number }) => <svg data-testid="play-icon" width={size} />,
  Pause: ({ size }: { size: number }) => <svg data-testid="pause-icon" width={size} />,
  Heart: ({ size, fill, className }: { size: number; fill?: string; className?: string }) => (
    <svg data-testid="heart-icon" width={size} data-fill={fill} className={className} />
  ),
  Plus: () => <svg data-testid="plus-icon" />,
  Moon: ({ size, className }: { size: number; className?: string }) => (
    <svg data-testid="moon-icon" width={size} className={className} />
  ),
  Trash: () => <svg data-testid="trash-icon" />,
  PlayCircle: () => <svg data-testid="play-circle-icon" />,
}));

describe('TrackItem', () => {
  const mockSong: Song = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    genre: 'Rock',
    filePath: '/path/to/song.mp3',
    durationMs: 180000,
    albumArtUrl: 'https://example.com/art.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    isLiked: false,
    likeCount: 5,
  };

  const defaultPlaybackControlsState: PlaybackControlsState = {
    isPlaying: false,
    progress: 0,
    maxDuration: 0,
    volume: 1,
    isShuffled: false,
    isRepeating: false,
    seekTime: null,
    sleepTimer: {
      isActive: false,
      endTime: null,
      duration: null,
    },
  };

  const defaultUserState: UserState = {
    id: null,
    email: null,
    name: null,
    picture: null,
    createdAt: null,
    updatedAt: null,
  };

  const defaultQueueState = {
    currentSong: null,
    upcomingSongs: [],
    playedSongs: [],
  };

  const createMockStore = (
    initialState: Partial<{
      playbackControls: PlaybackControlsState;
      queue: typeof defaultQueueState;
      user: UserState;
    }> = {},
  ) => {
    return configureStore({
      reducer: {
        playbackControls: playbackControlsReducer,
        queue: queueReducer,
        user: userReducer,
      },
      preloadedState: {
        playbackControls: {
          ...defaultPlaybackControlsState,
          ...(initialState.playbackControls || {}),
        },
        queue: { ...defaultQueueState, ...(initialState.queue || {}) },
        user: { ...defaultUserState, ...(initialState.user || {}) },
        ...initialState,
      },
    });
  };

  const renderWithProvider = (
    props: {
      index: number;
      song: Song;
      useLocalStorage?: boolean;
      playlistId?: string;
      isLikedSongsPlaylist?: boolean;
      onAddToPlaylist?: (song: Song) => void;
      playlistSongs?: Song[];
    },
    initialState = {},
  ) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <table>
          <tbody>
            <TrackItem {...props} />
          </tbody>
        </table>
      </Provider>,
    );
  };

  const defaultProps = {
    index: 0,
    song: mockSong,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders track item with basic information', () => {
    renderWithProvider(defaultProps);

    expect(screen.getByText('1')).toBeInTheDocument(); // Track number
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('renders track number correctly', () => {
    renderWithProvider({ ...defaultProps, index: 5 });

    expect(screen.getByText('6')).toBeInTheDocument(); // index + 1
  });

  it('renders play button when not currently playing', () => {
    renderWithProvider(defaultProps);

    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('pause-icon')).not.toBeInTheDocument();
  });

  it('renders pause button when currently playing', () => {
    const initialState = {
      playbackControls: {
        isPlaying: true,
        progress: 0,
        maxDuration: 0,
        volume: 1,
        isShuffled: false,
        isLooped: false,
        isMuted: false,
      },
      queue: {
        currentSong: mockSong,
        upcomingSongs: [],
        playedSongs: [],
      },
    };

    renderWithProvider(defaultProps, initialState);

    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
  });

  it('renders like button with correct state', () => {
    renderWithProvider(defaultProps);

    const likeButton = screen.getByText('5').closest('button');
    expect(likeButton).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Like count
  });

  it('renders liked state correctly', () => {
    const likedSong = { ...mockSong, isLiked: true, likeCount: 10 };
    renderWithProvider({ ...defaultProps, song: likedSong });

    const heartIcon = screen.getByTestId('heart-icon');
    expect(heartIcon).toHaveAttribute('data-fill', 'currentColor');
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('hides like button when useLocalStorage is true', () => {
    renderWithProvider({ ...defaultProps, useLocalStorage: true });

    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('renders album art placeholder', () => {
    renderWithProvider(defaultProps);

    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();
    expect(moonIcon).toHaveAttribute('width', '22');
    expect(moonIcon).toHaveClass('text-primary');
  });

  it('renders dropdown menu with correct items for regular song', () => {
    renderWithProvider(defaultProps);

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-item-add-to-queue')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-item-add-to-playlist')).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item-remove-from-playlist')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item-unlike')).not.toBeInTheDocument();
  });

  it('renders dropdown menu with remove option for playlist songs', () => {
    renderWithProvider({
      ...defaultProps,
      playlistId: 'playlist-123',
    });

    expect(screen.getByTestId('dropdown-item-add-to-queue')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-item-remove-from-playlist')).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item-add-to-playlist')).not.toBeInTheDocument();
  });

  it('renders dropdown menu with unlike option for liked songs playlist', () => {
    renderWithProvider({
      ...defaultProps,
      isLikedSongsPlaylist: true,
    });

    expect(screen.getByTestId('dropdown-item-add-to-queue')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-item-unlike')).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item-add-to-playlist')).not.toBeInTheDocument();
  });

  it('renders with missing album information', () => {
    const songWithoutAlbum = { ...mockSong, album: undefined };
    renderWithProvider({ ...defaultProps, song: songWithoutAlbum });

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    // Album cell should still be rendered but empty
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('renders with missing album art URL', () => {
    const songWithoutArt = { ...mockSong, albumArtUrl: undefined };
    renderWithProvider({ ...defaultProps, song: songWithoutArt });

    // Should still render the moon icon placeholder
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('renders with long song title and artist', () => {
    const longSong = {
      ...mockSong,
      title: 'This is a very long song title that might need to be truncated',
      artist: 'This is a very long artist name that might need to be truncated',
    };
    renderWithProvider({ ...defaultProps, song: longSong });

    expect(screen.getByText(longSong.title)).toBeInTheDocument();
    expect(screen.getByText(longSong.artist)).toBeInTheDocument();
  });

  it('renders with zero like count', () => {
    const songWithZeroLikes = { ...mockSong, likeCount: 0 };
    renderWithProvider({ ...defaultProps, song: songWithZeroLikes });

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with high like count', () => {
    const songWithManyLikes = { ...mockSong, likeCount: 999999 };
    renderWithProvider({ ...defaultProps, song: songWithManyLikes });

    expect(screen.getByText('999999')).toBeInTheDocument();
  });

  it('renders with correct CSS classes for current song', () => {
    const initialState = {
      queue: {
        currentSong: mockSong,
        upcomingSongs: [],
        playedSongs: [],
      },
    };

    renderWithProvider(defaultProps, initialState);

    const trackRow = screen.getByText('Test Song').closest('tr');
    expect(trackRow).toHaveClass('from-background-lighter/20 to-primary/30 bg-gradient-to-l');
  });

  it('renders with correct CSS classes for non-current song', () => {
    renderWithProvider(defaultProps);

    const trackRow = screen.getByText('Test Song').closest('tr');
    expect(trackRow).toHaveClass(
      'group hover:from-background-lighter/20 hover:to-primary/30 focus-within:from-background-lighter focus-within:to-primary/30 relative transition-all duration-300 ease-in-out focus-within:bg-gradient-to-l hover:bg-gradient-to-l',
    );
    expect(trackRow).not.toHaveClass('from-background-lighter/20 to-primary/30 bg-gradient-to-l');
  });

  it('renders track number cell with correct styling', () => {
    renderWithProvider(defaultProps);

    const trackNumberCell = screen.getByText('1').closest('td');
    expect(trackNumberCell).toHaveClass('relative w-14 min-w-10 py-4 text-center');
  });

  it('renders album art container with correct styling', () => {
    renderWithProvider(defaultProps);

    const albumArtContainer = screen.getByTestId('moon-icon').closest('div');
    expect(albumArtContainer).toHaveClass(
      'bg-primary/20 flex h-9 w-9 items-center justify-center rounded',
    );
  });

  it('renders song title with correct styling', () => {
    renderWithProvider(defaultProps);

    const songTitle = screen.getByText('Test Song');
    expect(songTitle).toHaveClass('truncate text-base font-normal text-gray-200');
  });

  it('renders artist name with correct styling', () => {
    renderWithProvider(defaultProps);

    const artistName = screen.getByText('Test Artist');
    expect(artistName).toHaveClass('truncate text-sm text-gray-400');
  });

  it('renders album name with responsive classes', () => {
    renderWithProvider(defaultProps);

    const albumCell = screen.getByText('Test Album').closest('td');
    expect(albumCell).toHaveClass('hidden truncate text-sm text-gray-400 sm:table-cell');
  });

  it('renders date added with responsive classes', () => {
    renderWithProvider(defaultProps);

    const dateCell = screen.getByText('2 days ago').closest('td');
    expect(dateCell).toHaveClass('hidden truncate text-sm text-gray-400 md:table-cell');
  });

  it('renders duration with correct styling', () => {
    renderWithProvider(defaultProps);

    const durationSpan = screen.getByText('3:00');
    expect(durationSpan).toHaveClass('text-sm text-gray-400');
  });

  it('renders like button with correct styling when not liked', () => {
    renderWithProvider(defaultProps);

    const likeButton = screen.getByText('5').closest('button');
    expect(likeButton).toHaveClass(
      'inline-flex cursor-pointer items-center justify-center gap-1 text-yellow-400 hover:text-primary',
    );
  });

  it('renders like button with correct styling when liked', () => {
    const likedSong = { ...mockSong, isLiked: true };
    renderWithProvider({ ...defaultProps, song: likedSong });

    const likeButton = screen.getByText('5').closest('button');
    expect(likeButton).toHaveClass(
      'inline-flex cursor-pointer items-center justify-center gap-1 text-primary hover:text-primary',
    );
  });

  it('renders action buttons container with correct styling', () => {
    renderWithProvider(defaultProps);

    const actionCell = screen.getByText('3:00').closest('td');
    expect(actionCell).toHaveClass('w-10 space-x-4 px-2');
  });

  it('renders action buttons flex container with correct styling', () => {
    renderWithProvider(defaultProps);

    const actionContainer = screen.getByTestId('dropdown-menu').parentElement;
    expect(actionContainer).toHaveClass('flex items-center justify-end gap-2');
  });

  it('renders with accessibility attributes', () => {
    renderWithProvider(defaultProps);

    const playButton = screen.getByTestId('play-icon').closest('button');
    expect(playButton).toHaveAttribute('aria-label', 'Play');

    const trackRow = screen.getByText('Test Song').closest('tr');
    expect(trackRow).toHaveAttribute('tabIndex', '0');
  });

  it('renders with correct accessibility attributes for playing state', () => {
    const initialState = {
      queue: {
        currentSong: mockSong,
        upcomingSongs: [],
        playedSongs: [],
      },
      playbackControls: {
        isPlaying: true,
        progress: 0,
        maxDuration: 0,
        volume: 1,
        isShuffled: false,
        isLooped: false,
        isMuted: false,
      },
    };

    renderWithProvider(defaultProps, initialState);

    const pauseButton = screen.getByTestId('pause-icon').closest('button');
    expect(pauseButton).toHaveAttribute('aria-label', 'Pause');
  });
});
