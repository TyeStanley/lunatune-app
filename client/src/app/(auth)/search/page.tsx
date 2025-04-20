'use client';

import { useAuth } from '@/hooks/useAuth';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const SONGS_API_URL = 'http://localhost:5133/api/songs';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [results, setResults] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth();

  useEffect(() => {
    const fetchSongs = async () => {
      const token = await getAccessTokenSilently();
      const songs = await fetch(SONGS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await songs.json();
      console.log(data);
    };

    fetchSongs();
  }, []);

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
      {/* <div className="bg-background-lighter rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Loading songs...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">{error}</p>
          </div>
        ) : (
          <>
            {results.map((song, index) => (
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
            {results.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400">No songs found</p>
              </div>
            )}
          </>
        )}
      </div> */}
    </div>
  );
}
