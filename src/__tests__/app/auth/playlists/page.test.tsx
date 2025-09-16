import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlaylistsPage from '@/app/(auth)/playlists/page';
import {
  useGetAllPlaylistsQuery,
  useAddPlaylistToLibraryMutation,
  useRemovePlaylistFromLibraryMutation,
  useDeletePlaylistMutation,
} from '@/redux/api/playlistApi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('@/redux/api/playlistApi');
jest.mock('@/hooks/useDebouncedValue');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock('@/components/PageHeader', () => ({
  PageHeader: () => <div data-testid="page-header">Header</div>,
}));
jest.mock('@/components/ui/SearchInput', () => ({
  SearchInput: (props: Record<string, unknown>) => (
    <input
      data-testid="search-input"
      value={props.value as string}
      onChange={(e) =>
        (props.onChange as (v: string) => void)?.((e.target as HTMLInputElement).value)
      }
    />
  ),
}));
jest.mock('@/components/ui/Pagination', () => ({
  Pagination: (props: Record<string, unknown>) => (
    <button
      data-testid="pagination"
      onClick={() => (props.onPageChange as (p: number) => void)?.(2)}
    >
      Page 2
    </button>
  ),
}));

const createMockMutation = () => {
  const fn = jest.fn(() => {
    const promise = Promise.resolve() as Promise<unknown> & { unwrap: () => Promise<unknown> };
    promise.unwrap = () => Promise.resolve();
    return promise;
  });
  return fn;
};

const mockUseGetAllPlaylistsQuery = useGetAllPlaylistsQuery as jest.Mock;
const mockUseAddPlaylistToLibraryMutation = useAddPlaylistToLibraryMutation as jest.Mock;
const mockUseRemovePlaylistFromLibraryMutation = useRemovePlaylistFromLibraryMutation as jest.Mock;
const mockUseDeletePlaylistMutation = useDeletePlaylistMutation as jest.Mock;
const mockUseDebouncedValue = useDebouncedValue as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

describe('PlaylistsPage', () => {
  let routerReplace: jest.Mock;
  let routerPush: jest.Mock;
  beforeEach(() => {
    mockUseDebouncedValue.mockImplementation((v) => v);
    routerReplace = jest.fn();
    routerPush = jest.fn();
    mockUseRouter.mockReturnValue({ replace: routerReplace, push: routerPush });
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'search' ? '' : undefined),
    });
    mockUseGetAllPlaylistsQuery.mockReturnValue({
      data: {
        playlists: [{ id: '1', name: 'Playlist', isCreator: false, isInLibrary: false }],
        totalPages: 1,
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockUseAddPlaylistToLibraryMutation.mockReturnValue([createMockMutation(), {}]);
    mockUseRemovePlaylistFromLibraryMutation.mockReturnValue([createMockMutation(), {}]);
    mockUseDeletePlaylistMutation.mockReturnValue([createMockMutation(), {}]);
  });
  afterEach(() => jest.clearAllMocks());

  it('renders header, search, and playlists list', () => {
    render(<PlaylistsPage />);
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByText('Playlist')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseGetAllPlaylistsQuery.mockReturnValue({ isLoading: true });
    const { container } = render(<PlaylistsPage />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseGetAllPlaylistsQuery.mockReturnValue({ isLoading: false, error: 'Error' });
    render(<PlaylistsPage />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    mockUseGetAllPlaylistsQuery.mockReturnValue({
      data: { playlists: [], totalPages: 1 },
      isLoading: false,
      error: null,
    });
    render(<PlaylistsPage />);
    expect(screen.getByText(/no playlists found/i)).toBeInTheDocument();
  });

  it('handles search input and resets page', async () => {
    render(<PlaylistsPage />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'test' } });
    await waitFor(() => {
      expect(routerReplace).toHaveBeenCalled();
    });
  });

  it('renders pagination if totalPages > 1 and handles page change', () => {
    mockUseGetAllPlaylistsQuery.mockReturnValue({
      data: {
        playlists: [{ id: '1', name: 'Playlist', isCreator: false, isInLibrary: false }],
        totalPages: 2,
      },
      isLoading: false,
      error: null,
    });
    render(<PlaylistsPage />);
    const pagination = screen.getByTestId('pagination');
    fireEvent.click(pagination);
    expect(routerReplace).toHaveBeenCalled();
  });
});

jest.spyOn(global.console, 'warn').mockImplementation((msg) => {
  if (msg.includes('fetchBaseQuery')) return;
  console.warn(msg);
});
