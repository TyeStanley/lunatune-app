'use client';

import { useState, useEffect } from 'react';
import { useGetUserPlaylistsQuery } from '@/redux/api/playlistApi';
import type { Playlist } from '@/constants';
import { SongsList } from '@/components/SongsList';
import { Moon } from 'lucide-react';
import LibrarySidebar from './LibrarySidebar';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export default function LibraryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const { data, isLoading, isError, refetch } = useGetUserPlaylistsQuery(
    { searchTerm: debouncedSearch },
    {
      skip: !user,
    },
  );
  const playlists: Playlist[] = data ?? [];
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | undefined>();

  // Set default selected playlist when playlists load
  useEffect(() => {
    if (!selectedPlaylist && playlists.length > 0) {
      setSelectedPlaylist(playlists[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists]);

  return (
    <div>
      <div className="mx-auto flex max-w-7xl gap-4 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <LibrarySidebar
          playlists={playlists}
          selectedPlaylistId={selectedPlaylist?.id}
          setSelectedPlaylistId={(id) => setSelectedPlaylist(playlists.find((p) => p.id === id))}
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
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
