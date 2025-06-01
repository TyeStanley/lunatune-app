import { useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGetUserPlaylistsQuery } from '@/redux/api/playlistApi';
import type { Playlist } from '@/constants';
import type { Song } from '@/types/song';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  onAddToPlaylist: (playlistId: string) => Promise<void>;
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  onAddToPlaylist,
}: AddToPlaylistModalProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const {
    data: userPlaylists,
    isLoading: isPlaylistsLoading,
    isError: isPlaylistsError,
  } = useGetUserPlaylistsQuery({ searchTerm: debouncedSearch });
  const [addError, setAddError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlaylist = async (playlistId: string) => {
    setAddError(null);
    try {
      await onAddToPlaylist(playlistId);
      onClose();
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: unknown }).data === 'object' &&
        (err as { data?: { message?: unknown } }).data !== null &&
        'message' in (err as { data: { message?: unknown } }).data &&
        typeof (err as { data: { message?: unknown } }).data.message === 'string'
      ) {
        setAddError((err as { data: { message: string } }).data.message);
      } else {
        setAddError('Failed to add song to playlist.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-40 w-full max-w-md">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Add to Playlist</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <input
            type="text"
            className="bg-background-lighter/40 focus:border-primary mb-3 w-full rounded-md border border-white/10 px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none"
            placeholder="Search your playlists"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {isPlaylistsLoading ? (
            <div className="py-4 text-center text-gray-400">Loading playlists...</div>
          ) : isPlaylistsError ? (
            <div className="py-4 text-center text-red-400">Failed to load playlists</div>
          ) : (
            <ul className="max-h-60 space-y-1 overflow-y-auto">
              {userPlaylists &&
              (userPlaylists as Playlist[]).filter((p: Playlist) => p.name !== 'Liked Songs')
                .length === 0 ? (
                <li className="py-2 text-center text-gray-400">No playlists found.</li>
              ) : (
                userPlaylists &&
                (userPlaylists as Playlist[])
                  .filter((p: Playlist) => p.name !== 'Liked Songs')
                  .map((playlist: Playlist) => (
                    <li key={playlist.id}>
                      <button
                        className="hover:bg-primary/10 flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-gray-200 transition-colors"
                        onClick={() => handleSelectPlaylist(playlist.id)}
                      >
                        <span className="font-medium">{playlist.name}</span>
                        {playlist.isCreator && (
                          <span className="text-primary ml-2 text-xs">(Owner)</span>
                        )}
                      </button>
                    </li>
                  ))
              )}
            </ul>
          )}
          {addError && <div className="mt-3 text-center text-sm text-red-400">{addError}</div>}
        </div>
      </div>
    </div>
  );
}
