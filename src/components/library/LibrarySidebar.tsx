import { Library, MoreVertical, Music, Pencil, Pin, Trash, User, Users } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Playlist } from '@/constants';
import { Dispatch, SetStateAction, useState } from 'react';
import { LibraryDropdown } from '@/components/library/LibraryDropdown';
import PlaylistModal from '@/components/library/PlaylistModal';
import {
  useCreatePlaylistMutation,
  useEditPlaylistMutation,
  useDeletePlaylistMutation,
  useRemovePlaylistFromLibraryMutation,
} from '@/redux/api/playlistApi';

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

type ModalMode = 'create' | 'edit' | 'delete' | 'remove';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalPlaylist, setModalPlaylist] = useState<Playlist | undefined>();

  const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();
  const [editPlaylist, { isLoading: isEditing }] = useEditPlaylistMutation();
  const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation();
  const [removePlaylistFromLibrary, { isLoading: isRemoving }] =
    useRemovePlaylistFromLibraryMutation();

  const handleModalAction = async (name?: string, description?: string) => {
    setModalError(null);
    try {
      if (modalMode === 'create') {
        await createPlaylist({ name: name!, description: description! }).unwrap();
      } else if (modalMode === 'edit' && modalPlaylist) {
        await editPlaylist({
          id: modalPlaylist.id,
          name: name!,
          description: description!,
        }).unwrap();
      } else if (modalMode === 'delete' && modalPlaylist) {
        await deletePlaylist(modalPlaylist.id).unwrap();
      } else if (modalMode === 'remove' && modalPlaylist) {
        await removePlaylistFromLibrary({ playlistId: modalPlaylist.id }).unwrap();
      }
      if (refetch) refetch();
      setModalOpen(false);
    } catch (err: unknown) {
      setModalError(
        err instanceof Error
          ? err.message
          : modalMode === 'create'
            ? 'Failed to create playlist.'
            : modalMode === 'edit'
              ? 'Failed to edit playlist.'
              : modalMode === 'delete'
                ? 'Failed to delete playlist.'
                : 'Failed to remove playlist.',
      );
    }
  };

  // Open modal for create, edit, delete, or remove
  const openModal = (playlist: Playlist | undefined, mode: ModalMode) => {
    setModalMode(mode);
    setModalPlaylist(playlist);
    setModalError(null);
    setModalOpen(true);
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
          <LibraryDropdown
            options={[
              {
                label: 'Create Playlist',
                itemIcon: <Music size={16} className="text-gray-400" />,
                onClick: () => openModal(undefined, 'create'),
              },
            ]}
          />
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
              {playlists.map((playlist: Playlist) => (
                <li
                  key={playlist.id}
                  className={`group hover:text-primary hover:bg-primary/10 focus:bg-primary/20 focus:text-primary flex w-full items-center justify-between rounded-lg text-left font-medium text-gray-200 transition-colors focus:outline-none ${
                    selectedPlaylistId === playlist.id
                      ? 'bg-primary/20 text-primary hover:bg-primary/20'
                      : ''
                  }`}
                >
                  <button
                    className="flex w-full items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-left"
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                  >
                    {/* Ownership icon */}
                    {playlist.name !== 'Liked Songs' &&
                      (playlist.isCreator ? (
                        <User size={16} className="text-primary" />
                      ) : (
                        <Users size={16} className="text-gray-400" />
                      ))}
                    {/* Pin for Liked Songs */}
                    {playlist.name === 'Liked Songs' && (
                      <Pin size={16} className="text-yellow-400" />
                    )}
                    {playlist.name}
                  </button>
                  {playlist.name !== 'Liked Songs' && (
                    <div className="invisible group-focus-within:visible group-hover:visible">
                      <LibraryDropdown
                        btnClassName="bg-transparent"
                        icon={<MoreVertical size={20} className="text-gray-400" />}
                        options={
                          playlist.isCreator
                            ? [
                                {
                                  label: 'Edit',
                                  itemIcon: <Pencil size={16} className="text-gray-400" />,
                                  onClick: () => openModal(playlist, 'edit'),
                                },
                                {
                                  label: 'Delete',
                                  itemIcon: <Trash size={16} className="text-gray-400" />,
                                  onClick: () => openModal(playlist, 'delete'),
                                },
                              ]
                            : [
                                {
                                  label: 'Remove from Library',
                                  itemIcon: <Trash size={16} className="text-gray-400" />,
                                  onClick: () => openModal(playlist, 'remove'),
                                },
                              ]
                        }
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
      <PlaylistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalAction}
        onDelete={modalMode === 'delete' ? () => handleModalAction() : undefined}
        onRemove={modalMode === 'remove' ? () => handleModalAction() : undefined}
        error={modalError}
        isLoading={
          modalMode === 'create'
            ? isCreating
            : modalMode === 'edit'
              ? isEditing
              : modalMode === 'delete'
                ? isDeleting
                : modalMode === 'remove'
                  ? isRemoving
                  : false
        }
        mode={modalMode}
        playlist={modalPlaylist}
      />
    </>
  );
}
