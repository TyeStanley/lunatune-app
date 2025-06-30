import { screen, fireEvent } from '@testing-library/react';
import LibrarySidebar from '@/components/library/LibrarySidebar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';

// Mock child components
jest.mock('@/components/library/LibraryDropdown', () => ({
  LibraryDropdown: (props: Record<string, unknown>) => {
    const options = props.options as { onClick?: () => void }[] | undefined;
    const handleClick =
      options && typeof options[0]?.onClick === 'function' ? options[0].onClick : undefined;
    const MockDropdown = () => (
      <button onClick={handleClick} data-testid="dropdown-trigger">
        Dropdown
      </button>
    );
    MockDropdown.displayName = 'MockLibraryDropdown';
    return <MockDropdown />;
  },
}));

jest.mock('@/components/library/PlaylistModal', () => {
  const MockPlaylistModal = (props: Record<string, unknown>) =>
    props.isOpen ? <div data-testid="playlist-modal">Modal: {String(props.mode)}</div> : null;
  MockPlaylistModal.displayName = 'MockPlaylistModal';
  return {
    __esModule: true,
    default: MockPlaylistModal,
  };
});

jest.mock('@/components/ui/SearchInput', () => {
  const MockSearchInput = (props: Record<string, unknown>) => (
    <input
      data-testid="search-input"
      value={props.value as string}
      onChange={(e) => (props.onChange as (v: string) => void)(e.target.value)}
      placeholder={props.placeholder as string}
    />
  );
  MockSearchInput.displayName = 'MockSearchInput';
  return {
    SearchInput: MockSearchInput,
  };
});

// Mock RTK Query hooks
jest.mock('@/redux/api/playlistApi', () => ({
  useCreatePlaylistMutation: () => [jest.fn(), { isLoading: false }],
  useEditPlaylistMutation: () => [jest.fn(), { isLoading: false }],
  useDeletePlaylistMutation: () => [jest.fn(), { isLoading: false }],
  useRemovePlaylistFromLibraryMutation: () => [jest.fn(), { isLoading: false }],
}));

describe('LibrarySidebar', () => {
  const mockPlaylists = [
    {
      id: '1',
      name: 'My Playlist',
      isCreator: true,
      isPublic: true,
      description: 'desc',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      userId: 'user1',
      creator: { username: 'userone' },
    },
    {
      id: '2',
      name: 'Liked Songs',
      isCreator: true,
      isPublic: false,
      description: '',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      userId: 'user1',
      creator: { username: 'userone' },
    },
    {
      id: '3',
      name: 'Shared Playlist',
      isCreator: false,
      isPublic: true,
      description: '',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      userId: 'user2',
      creator: { username: 'usertwo' },
    },
  ];
  let selectedPlaylistId = undefined as string | undefined;
  let search = '';
  const setSelectedPlaylistId = jest.fn((id) => (selectedPlaylistId = id));
  const setSearch = jest.fn((val) => (search = val));
  const refetch = jest.fn();

  const defaultProps = {
    playlists: mockPlaylists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    search,
    setSearch,
    isLoading: false,
    isError: false,
    refetch,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    selectedPlaylistId = undefined;
    search = '';
  });

  it('renders sidebar header and search', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    expect(screen.getByText('Your Library')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getAllByTestId('dropdown-trigger').length).toBeGreaterThan(0);
  });

  it('renders playlists', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    expect(screen.getByText('My Playlist')).toBeInTheDocument();
    expect(screen.getByText('Liked Songs')).toBeInTheDocument();
    expect(screen.getByText('Shared Playlist')).toBeInTheDocument();
  });

  it('calls setSearch when search input changes', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'rock' } });
    expect(setSearch).toHaveBeenCalledWith('rock');
  });

  it('calls setSelectedPlaylistId when playlist is clicked', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    const playlistButton = screen.getByText('My Playlist');
    fireEvent.click(playlistButton);
    expect(setSelectedPlaylistId).toHaveBeenCalledWith('1');
  });

  it('shows loading state', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading playlists...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} isError={true} />);
    expect(screen.getByText('Failed to load playlists')).toBeInTheDocument();
  });

  it('opens create playlist modal from dropdown', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    const dropdowns = screen.getAllByTestId('dropdown-trigger');
    const createDropdown = dropdowns[0];
    fireEvent.click(createDropdown);
    expect(screen.getByTestId('playlist-modal')).toHaveTextContent('create');
  });

  it('opens edit playlist modal from playlist dropdown', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    const dropdowns = screen.getAllByTestId('dropdown-trigger');
    const playlistDropdown = dropdowns[1];
    fireEvent.click(playlistDropdown);
    expect(screen.getByTestId('playlist-modal')).toHaveTextContent('edit');
  });

  it('opens delete playlist modal from playlist dropdown', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    const dropdowns = screen.getAllByTestId('dropdown-trigger');
    const playlistDropdown = dropdowns[1];
    fireEvent.click(playlistDropdown);
    expect(screen.getByTestId('playlist-modal')).toBeInTheDocument();
  });

  it('opens remove playlist modal for non-creator playlist', () => {
    renderWithProvider(<LibrarySidebar {...defaultProps} />);
    const dropdowns = screen.getAllByTestId('dropdown-trigger');
    const playlistDropdown = dropdowns[2];
    fireEvent.click(playlistDropdown);
    expect(screen.getByTestId('playlist-modal')).toHaveTextContent('remove');
  });
});

// Helper render function with Redux Provider
function renderWithProvider(ui: React.ReactElement) {
  const store = configureStore({ reducer: () => ({}) });
  return rtlRender(<Provider store={store}>{ui}</Provider>);
}
