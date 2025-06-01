import { Library } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Playlist } from '@/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { LibraryDropdown } from '@/components/library/LibraryDropdown';
import CreatePlaylistModal from '@/components/library/CreatePlaylistModal';
import { useCreatePlaylistMutation } from '@/redux/api/playlistApi';

interface LibrarySidebarProps {
  playlists: Playlist[];
  selectedPlaylistId: string | undefined;
  setSelectedPlaylistId: Dispatch<SetStateAction<string | undefined>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  isError: boolean;
  refetch?: () => void;
}

export default function LibrarySidebar({
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
  search,
  setSearch,
  isLoading,
  isError,
  refetch,
}: LibrarySidebarProps) {
  // Filter playlists by search
  const filteredPlaylists = playlists.filter(
    (playlist: Playlist) =>
      playlist.name.toLowerCase().includes(search.toLowerCase()) ||
      (playlist.description?.toLowerCase().includes(search.toLowerCase()) ?? false),
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();

  const handleOpenModal = () => {
    setIsCreateModalOpen(true);
    setCreateError(null);
  };

  const handleCreate = async (name: string, description: string) => {
    setCreateError(null);
    try {
      await createPlaylist({ name, description }).unwrap();
      if (refetch) {
        refetch();
      }
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create playlist.');
    }
  };

  return (
    <>
      <aside className="flex h-screen w-56 flex-col border-r border-white/10 md:w-72">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pt-6 pr-4 pb-4">
          <div className="flex items-center gap-2">
            <Library size={22} className="text-primary" />
            <span className="text-lg font-semibold text-gray-200">Your Library</span>
          </div>
          <LibraryDropdown onCreatePlaylist={handleOpenModal} />
        </div>
        <div className="mb-3 pr-4 pb-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search your playlists" />
        </div>

        {/* Playlists */}
        <nav className="flex-1 pr-4 pb-4">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-400">Loading playlists...</div>
          ) : isError ? (
            <div className="px-4 py-2 text-red-400">Failed to load playlists</div>
          ) : (
            <ul className="flex flex-col gap-1">
              {filteredPlaylists.map((playlist: Playlist) => (
                <li key={playlist.id}>
                  <button
                    className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/20 focus:text-primary w-full rounded-lg px-4 py-2 text-left font-medium text-gray-200 transition-colors focus:outline-none ${
                      selectedPlaylistId === playlist.id ? 'bg-primary/20 text-primary' : ''
                    }`}
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                  >
                    {playlist.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        error={createError}
        isLoading={isCreating}
      />
    </>
  );
}
