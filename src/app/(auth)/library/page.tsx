'use client';

import { useState, useRef, useEffect } from 'react';
import { fakePlaylists } from '@/constants';
import { SongsList } from '@/components/SongsList';
import { Library, Plus } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';

export default function LibraryPage() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(fakePlaylists[0]?.id);
  const [search, setSearch] = useState('');
  const selectedPlaylist = fakePlaylists.find((p) => p.id === selectedPlaylistId);

  // Filter playlists by search
  const filteredPlaylists = fakePlaylists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(search.toLowerCase()) ||
      (playlist.description?.toLowerCase().includes(search.toLowerCase()) ?? false),
  );

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="bg-background flex h-screen w-72 shrink-0 flex-col border-r border-white/10">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pt-6 pr-4 pb-4">
            <div className="flex items-center gap-2">
              <Library size={22} className="text-primary" />
              <span className="text-lg font-semibold text-gray-200">Your Library</span>
            </div>
            <LibraryCreateDropdown />
          </div>
          <div className="mb-3 pr-4 pb-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search your playlists" />
          </div>
          <nav className="flex-1 pr-4 pb-4">
            <ul className="flex flex-col gap-1">
              {filteredPlaylists.map((playlist) => (
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
          </nav>
        </aside>

        {/* Main Content: Playlist Songs */}
        <main className="h-screen min-w-0 flex-1 py-0">
          <div className="h-full w-full px-8 py-10">
            <div className="mb-8">
              <h2 className="mb-1 text-2xl font-semibold text-gray-200">
                {selectedPlaylist?.name}
              </h2>
              {selectedPlaylist?.description && (
                <p className="text-sm text-gray-400">{selectedPlaylist.description}</p>
              )}
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

// Dropdown button for creating a playlist
function LibraryCreateDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="bg-background-lighter/30 hover:bg-primary/20 hover:text-primary flex items-center justify-center rounded-full p-2 text-gray-200 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Create"
      >
        <Plus size={20} />
      </button>
      {open && (
        <div className="bg-background-lighter/90 absolute right-0 z-10 mt-2 w-40 rounded-md border border-white/10 shadow-lg">
          <button
            className="hover:bg-primary/10 hover:text-primary w-full rounded-md px-4 py-2 text-left text-gray-200 transition-colors"
            onClick={() => {
              setOpen(false);
              // TODO: trigger create playlist modal or logic
              alert('Create Playlist clicked!');
            }}
          >
            Create Playlist
          </button>
        </div>
      )}
    </div>
  );
}
