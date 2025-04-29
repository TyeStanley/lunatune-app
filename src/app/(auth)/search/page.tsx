'use client';

import TrackItem from '@/components/TrackItem';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useGetSongsQuery } from '@/redux/api/songApi';
import { Song } from '@/types/song';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: songs = [], isLoading, error } = useGetSongsQuery(undefined);

  const filteredSongs = songs.filter((song: Song) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(searchLower) ||
      song.artist.toLowerCase().includes(searchLower) ||
      song.album?.toLowerCase().includes(searchLower)
    );
  });

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background-lighter flex-1 text-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="bg-background-lighter rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Loading songs...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Error loading songs</p>
          </div>
        ) : (
          <>
            {filteredSongs.map((song: Song, index: number) => (
              <TrackItem
                key={song.id}
                index={index}
                id={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album || ''}
                dateAdded={song.createdAt || ''}
                durationMs={song.durationMs}
              />
            ))}
            {filteredSongs.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400">No songs found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
