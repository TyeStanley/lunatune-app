'use client';

import { useState, useEffect } from 'react';
import { useGetUserPlaylistsQuery } from '@/redux/api/playlistApi';
import type { Playlist } from '@/constants';
import { SongsList } from '@/components/SongsList';
import { Moon } from 'lucide-react';
import LibrarySidebar from './LibrarySidebar';
import { useAuth } from '@/hooks/useAuth';

export default function LibraryPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetUserPlaylistsQuery(
    { searchTerm: '' },
    {
      skip: !user,
    },
  );
  const playlists: Playlist[] = data ?? [];
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  // Set default selected playlist when playlists load
  useEffect(() => {
    if (!selectedPlaylistId && playlists.length > 0) {
      setSelectedPlaylistId(playlists[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists]);

  const selectedPlaylist = playlists.find((p: Playlist) => p.id === selectedPlaylistId);

  return (
    <div>
      <div className="mx-auto flex max-w-7xl gap-4 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <LibrarySidebar
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          setSelectedPlaylistId={setSelectedPlaylistId}
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
          isError={isError}
        />

        {/* Main Content: Playlist Songs */}
        <main className="h-screen min-w-0 flex-1 py-0">
          <div className="h-full w-full py-4 pl-4">
            <div className="from-primary/30 to-background/0 via-primary/10 mb-8 flex items-center gap-6 rounded-lg bg-gradient-to-r p-6">
              <div className="bg-primary/20 flex h-20 w-20 items-center justify-center rounded-lg">
                <Moon size={38} className="text-primary" />
              </div>
              <div>
                <h2 className="mb-1 text-2xl font-semibold text-gray-200">
                  {selectedPlaylist?.name}
                </h2>
                {selectedPlaylist?.description && (
                  <p className="text-sm text-gray-400">{selectedPlaylist.description}</p>
                )}
              </div>
            </div>
            <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
              <SongsList
                songs={selectedPlaylist?.songs || []}
                currentPage={1}
                isLoading={false}
                isFetching={false}
                error={undefined}
                emptyMessage="No songs in this playlist."
                useLocalStorage={true}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
