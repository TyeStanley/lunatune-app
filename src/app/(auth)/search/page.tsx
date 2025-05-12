'use client';

import TrackItem from '@/components/TrackItem';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetSongsQuery } from '@/redux/api/songApi';
import { Song } from '@/types/song';
import { Pagination } from '@/components/ui/Pagination';

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching, error } = useGetSongsQuery({
    searchTerm: debouncedSearchQuery,
    page: currentPage,
  });

  const songs = data?.songs || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col items-stretch gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="max-w-md flex-1">
          <div className="bg-background-lighter flex items-center gap-3 rounded-lg px-4 py-2">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search songs, artists, albums"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-background-lighter flex-1 text-gray-200 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="w-full md:w-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="bg-background-lighter rounded-lg">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Loading songs...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-400">Error loading songs</p>
          </div>
        ) : (
          <>
            {data?.songs.map((song: Song, index: number) => (
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
            {songs.length === 0 && (
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
