import { render, screen, fireEvent } from '@testing-library/react';
import PlaylistPage from '@/app/(auth)/playlists/[id]/page';
import { useGetPlaylistQuery, useAddSongToPlaylistMutation } from '@/redux/api/playlistApi';
import { useParams, useRouter } from 'next/navigation';

jest.mock('@/redux/api/playlistApi');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock('@/components/PageHeader', () => ({
  PageHeader: (props: { title: string }) => <div data-testid="page-header">{props.title}</div>,
}));
jest.mock('@/components/SongsList', () => ({
  SongsList: (props: Record<string, unknown>) => (
    <div data-testid="songs-list">
      {Array.isArray(props.songs) && props.songs.length ? 'Songs' : 'No songs'}
    </div>
  ),
}));
jest.mock(
  '@/components/library/AddToPlaylistModal',
  () =>
    function AddToPlaylistModalMock(props: { isOpen: boolean }) {
      return props.isOpen ? <div data-testid="add-modal">Modal</div> : null;
    },
);

const createMockMutation = () => {
  const fn = jest.fn(() => {
    const promise = Promise.resolve() as Promise<unknown> & { unwrap: () => Promise<unknown> };
    promise.unwrap = () => Promise.resolve();
    return promise;
  });
  return fn;
};

const mockUseGetPlaylistQuery = useGetPlaylistQuery as jest.Mock;
const mockUseAddSongToPlaylistMutation = useAddSongToPlaylistMutation as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('PlaylistPage', () => {
  let routerBack: jest.Mock;
  beforeEach(() => {
    routerBack = jest.fn();
    mockUseParams.mockReturnValue({ id: 'playlist-1' });
    mockUseRouter.mockReturnValue({ back: routerBack });
    mockUseGetPlaylistQuery.mockReturnValue({
      data: {
        id: 'playlist-1',
        name: 'Test Playlist',
        songs: [{ id: 'song-1', title: 'Test Song' }],
      },
      isLoading: false,
      error: null,
    });
    mockUseAddSongToPlaylistMutation.mockReturnValue([createMockMutation(), {}]);
  });
  afterEach(() => jest.clearAllMocks());

  it('renders header, back button, and songs list', () => {
    render(<PlaylistPage />);
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByText(/back to playlists/i)).toBeInTheDocument();
    expect(screen.getByTestId('songs-list')).toHaveTextContent('Songs');
  });

  it('shows loading state', () => {
    mockUseGetPlaylistQuery.mockReturnValue({ isLoading: true });
    render(<PlaylistPage />);
    expect(screen.getByText(/loading playlist/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseGetPlaylistQuery.mockReturnValue({ isLoading: false, error: 'Error' });
    render(<PlaylistPage />);
    expect(screen.getByText(/error loading playlist/i)).toBeInTheDocument();
  });

  it('shows empty playlist state', () => {
    mockUseGetPlaylistQuery.mockReturnValue({
      data: { id: 'playlist-1', name: 'Test Playlist', songs: [] },
      isLoading: false,
      error: null,
    });
    render(<PlaylistPage />);
    expect(screen.getByText(/no songs in this playlist yet/i)).toBeInTheDocument();
  });

  it('handles back button click', () => {
    render(<PlaylistPage />);
    fireEvent.click(screen.getByText(/back to playlists/i));
    expect(routerBack).toHaveBeenCalled();
  });

  it('renders playlist name in header', () => {
    render(<PlaylistPage />);
    expect(screen.getByText('Test Playlist')).toBeInTheDocument();
  });
});
