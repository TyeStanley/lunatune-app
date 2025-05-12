'use client';

import TrackItem from '@/components/TrackItem';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetSongsQuery } from '@/redux/api/songApi';
import { Song } from '@/types/song';
import { Pagination } from '@/components/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (currentPage > 1) params.set('page', String(currentPage));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, currentPage, router]);

  const { data, isLoading, isFetching, error } = useGetSongsQuery({
    searchTerm: debouncedSearchQuery,
    page: currentPage,
  });

  const songs = data?.songs || [];
  const totalPages = data?.totalPages || 1;
  const pageSize = songs.length > 0 ? songs.length : 10;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col items-stretch gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="max-w-md flex-1">
          <div className="bg-background-lighter flex items-center gap-3 rounded-lg px-4 py-2">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search songs, artists"
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
                index={(currentPage - 1) * pageSize + index}
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
