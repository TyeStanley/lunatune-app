import { Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LibraryDropdownProps {
  onCreatePlaylist: () => void;
}

export function LibraryDropdown({ onCreatePlaylist }: LibraryDropdownProps) {
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
              onCreatePlaylist();
            }}
          >
            Create Playlist
          </button>
        </div>
      )}
    </div>
  );
}
