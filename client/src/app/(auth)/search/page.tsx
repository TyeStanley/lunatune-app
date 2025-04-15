'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import TrackItem from '@/components/TrackItem';

// Temporary mock data - will be replaced with real search results later
const mockResults = [
  {
    id: '1',
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    album: '=',
    dateAdded: new Date().toISOString(),
    durationMs: 231000, // 3:51
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    dateAdded: new Date().toISOString(),
    durationMs: 200000, // 3:20
  },
  {
    id: '3',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    dateAdded: new Date().toISOString(),
    durationMs: 200500, // 3:20
  },
  {
    id: '4',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    dateAdded: new Date().toISOString(),
    durationMs: 167000, // 2:47
  },
  {
    id: '5',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    dateAdded: new Date().toISOString(),
    durationMs: 200000, // 3:20
  },
  {
    id: '6',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    album: 'Lover',
    dateAdded: new Date().toISOString(),
    durationMs: 178000, // 2:58
  },
  {
    id: '7',
    title: 'vampire',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    dateAdded: new Date().toISOString(),
    durationMs: 220000, // 3:40
  },
  {
    id: '8',
    title: 'Last Night',
    artist: 'Morgan Wallen',
    album: 'One Thing at a Time',
    dateAdded: new Date().toISOString(),
    durationMs: 169000, // 2:49
  },
  {
    id: '9',
    title: 'Rich Flex',
    artist: 'Drake & 21 Savage',
    album: 'Her Loss',
    dateAdded: new Date().toISOString(),
    durationMs: 239000, // 3:59
  },
  {
    id: '10',
    title: 'Unholy',
    artist: 'Sam Smith & Kim Petras',
    album: 'Gloria',
    dateAdded: new Date().toISOString(),
    durationMs: 156000, // 2:36
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockResults);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // For now, just filter mock results
    // This will be replaced with actual API calls later
    if (query) {
      const filtered = mockResults.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered);
    } else {
      setResults(mockResults);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Input */}
      <div className="mb-8">
        <div className="bg-background-lighter flex items-center gap-3 rounded-lg px-4 py-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search songs, artists, albums"
            value={searchQuery}
            onChange={handleSearch}
            className="bg-background-lighter flex-1 text-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="bg-background-lighter rounded-lg">
        {results.map((song, index) => (
          <TrackItem
            key={song.id}
            index={index}
            id={song.id}
            title={song.title}
            artist={song.artist}
            album={song.album}
            dateAdded={song.dateAdded}
            durationMs={song.durationMs}
          />
        ))}
        {results.length === 0 && searchQuery && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">No results found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
