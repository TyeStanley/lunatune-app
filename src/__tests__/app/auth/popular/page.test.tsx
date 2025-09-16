import { render, screen, fireEvent } from '@testing-library/react';
import PopularSongs from '@/app/(auth)/popular/page';
import { useGetPopularSongsQuery } from '@/redux/api/songApi';
import { useAddSongToPlaylistMutation } from '@/redux/api/playlistApi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('@/redux/api/songApi');
jest.mock('@/redux/api/playlistApi');
jest.mock('@/hooks/useDebouncedValue');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock('@/components/PageHeader', () => ({
  PageHeader: (props: { title: string }) => <div data-testid="page-header">{props.title}</div>,
}));

// SongsList mock that handles loading, error, and empty states
let SongsListMock: React.FC<Record<string, unknown>> = (props) => {
  if (props.isLoading) return <div>Loading popular songs...</div>;
  if (props.error) return <div>Error loading popular songs.</div>;
  if (Array.isArray(props.songs) && (props.songs as unknown[]).length)
    return <div data-testid="songs-list">Songs</div>;
  return <div data-testid="songs-list">{props.emptyMessage as string}</div>;
};
SongsListMock.displayName = 'SongsListMock';

jest.mock('@/components/SongsList', () => ({
  SongsList: (props: Record<string, unknown>) => SongsListMock(props),
}));
jest.mock('@/components/ui/SearchInput', () => {
  const SearchInputMock = (props: Record<string, unknown>) => (
    <input
      data-testid="search-input"
      value={props.value as string}
      onChange={(e) =>
        (props.onChange as (v: string) => void)((e.target as HTMLInputElement).value)
      }
      placeholder={props.placeholder as string}
    />
  );
  SearchInputMock.displayName = 'SearchInputMock';
  return { SearchInput: SearchInputMock };
});
jest.mock('@/components/ui/Pagination', () => {
  const PaginationMock = (props: Record<string, unknown>) => (
    <div data-testid="pagination">
      Page {props.currentPage as number} of {props.totalPages as number}
    </div>
  );
  PaginationMock.displayName = 'PaginationMock';
  return { Pagination: PaginationMock };
});
jest.mock('@/components/library/AddToPlaylistModal', () => {
  function AddToPlaylistModalMock(props: { isOpen: boolean }) {
    return props.isOpen ? <div data-testid="add-modal">Modal</div> : null;
  }
  AddToPlaylistModalMock.displayName = 'AddToPlaylistModalMock';
  return AddToPlaylistModalMock;
});

const mockUseGetPopularSongsQuery = useGetPopularSongsQuery as jest.Mock;
const mockUseAddSongToPlaylistMutation = useAddSongToPlaylistMutation as jest.Mock;
const mockUseDebouncedValue = useDebouncedValue as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

const createMockMutation = () => {
  const fn = jest.fn(() => {
    const promise = Promise.resolve() as Promise<unknown> & { unwrap: () => Promise<unknown> };
    promise.unwrap = () => Promise.resolve();
    return promise;
  });
  return fn;
};

describe('PopularSongs page', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({ replace: jest.fn() });
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'search' ? '' : undefined),
    });
    mockUseDebouncedValue.mockImplementation((v) => v);
    mockUseGetPopularSongsQuery.mockReturnValue({
      data: { songs: [{ id: '1', title: 'Song 1' }], totalPages: 1 },
      isLoading: false,
      isFetching: false,
      error: null,
    });
    mockUseAddSongToPlaylistMutation.mockReturnValue([createMockMutation(), {}]);
  });
  afterEach(() => jest.clearAllMocks());

  it('renders header, search input, and songs list', () => {
    render(<PopularSongs />);
    expect(screen.getByTestId('page-header')).toHaveTextContent('Popular Songs');
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('songs-list')).toHaveTextContent('Songs');
  });

  it('shows loading state', () => {
    mockUseGetPopularSongsQuery.mockReturnValue({ isLoading: true });
    render(<PopularSongs />);
    expect(screen.getByText(/loading popular songs/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseGetPopularSongsQuery.mockReturnValue({ isLoading: false, error: 'Error' });
    render(<PopularSongs />);
    expect(screen.getByText(/error loading popular songs/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    mockUseGetPopularSongsQuery.mockReturnValue({
      data: { songs: [], totalPages: 1 },
      isLoading: false,
      isFetching: false,
      error: null,
    });
    render(<PopularSongs />);
    expect(screen.getByText(/no popular songs found/i)).toBeInTheDocument();
  });

  it('renders pagination if totalPages > 1', () => {
    mockUseGetPopularSongsQuery.mockReturnValue({
      data: { songs: [{ id: '1', title: 'Song 1' }], totalPages: 3 },
      isLoading: false,
      isFetching: false,
      error: null,
    });
    render(<PopularSongs />);
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 1 of 3');
  });

  it('search input changes value', () => {
    render(<PopularSongs />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'rock' } });
    expect(input.value).toBe('rock');
  });

  it('shows add to playlist modal when triggered', () => {
    // Patch SongsListMock to include add button for this test
    SongsListMock = ((props: Record<string, unknown>) => {
      const AddButtonComponent: React.FC = () => (
        <button
          data-testid="add-btn"
          onClick={() =>
            props.onAddToPlaylist &&
            (props.onAddToPlaylist as (song: { id: string; title: string }) => void)({
              id: '1',
              title: 'Song 1',
            })
          }
        >
          Add
        </button>
      );
      AddButtonComponent.displayName = 'AddButtonComponent';

      const SongsListComponent: React.FC = () => <div data-testid="songs-list">Songs</div>;
      SongsListComponent.displayName = 'SongsListComponent';

      return (
        <>
          <AddButtonComponent />
          <SongsListComponent />
        </>
      );
    }) as React.FC<Record<string, unknown>>;
    SongsListMock.displayName = 'SongsListMock';
    render(<PopularSongs />);
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('add-modal')).toBeInTheDocument();
    // Restore SongsListMock for other tests
    SongsListMock = ((props: Record<string, unknown>) => {
      if (props.isLoading) return <div>Loading popular songs...</div>;
      if (props.error) return <div>Error loading popular songs.</div>;
      if (Array.isArray(props.songs) && (props.songs as unknown[]).length)
        return <div data-testid="songs-list">Songs</div>;
      return <div data-testid="songs-list">{props.emptyMessage as string}</div>;
    }) as React.FC<Record<string, unknown>>;
    SongsListMock.displayName = 'SongsListMock';
  });
});
