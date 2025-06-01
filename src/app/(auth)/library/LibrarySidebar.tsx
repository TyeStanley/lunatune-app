import { Library, Plus } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Playlist } from '@/constants';
import { Dispatch, SetStateAction } from 'react';

interface LibrarySidebarProps {
  playlists: Playlist[];
  selectedPlaylistId: string | undefined;
  setSelectedPlaylistId: Dispatch<SetStateAction<string | undefined>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  isError: boolean;
}

export default function LibrarySidebar({
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
  search,
  setSearch,
  isLoading,
  isError,
}: LibrarySidebarProps) {
  // Filter playlists by search
  const filteredPlaylists = playlists.filter(
    (playlist: Playlist) =>
      playlist.name.toLowerCase().includes(search.toLowerCase()) ||
      (playlist.description?.toLowerCase().includes(search.toLowerCase()) ?? false),
  );

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/10 md:w-72">
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
  );
}

// Dropdown button for creating a playlist
import { useState, useRef, useEffect } from 'react';
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
