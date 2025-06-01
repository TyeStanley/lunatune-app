'use client';

import React, { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SongsList } from '@/components/SongsList';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Song } from '@/types/song';
import AddToPlaylistModal from '@/components/library/AddToPlaylistModal';
import { useAddSongToPlaylistMutation } from '@/redux/api/playlistApi';

const PLAYED_SONGS_STORAGE_KEY = 'lunatune_played_songs';

export default function RecentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  // Add to Playlist modal state
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (currentPage > 1) params.set('page', String(currentPage));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, currentPage, router]);

  useEffect(() => {
    // Load songs from local storage
    const loadRecentSongs = () => {
      try {
        const storedSongs = localStorage.getItem(PLAYED_SONGS_STORAGE_KEY);
        const songs = storedSongs ? JSON.parse(storedSongs) : [];
        // Filter songs based on search query
        const filteredSongs = debouncedSearchQuery
          ? songs.filter(
              (song: Song) =>
                song.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                song.artist.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
            )
          : songs;
        setRecentSongs(filteredSongs);
      } catch (error) {
        console.error('Error loading recent songs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentSongs();
  }, [debouncedSearchQuery]);

  const SONGS_PER_PAGE = 10;
  const totalPages = Math.ceil(recentSongs.length / SONGS_PER_PAGE);
  const startIndex = (currentPage - 1) * SONGS_PER_PAGE;
  const paginatedSongs = recentSongs.slice(startIndex, startIndex + SONGS_PER_PAGE);

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setShowAddToPlaylistModal(true);
  };

  const handleAddToPlaylistSubmit = async (playlistId: string) => {
    if (!selectedSong) return;
    await addSongToPlaylist({ playlistId, songId: selectedSong.id });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader icon={History} title="Recently Played" />

      <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
        <div className="mb-4 flex flex-col items-stretch gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search recent songs"
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        <SongsList
          songs={paginatedSongs}
          currentPage={currentPage}
          isLoading={isLoading}
          isFetching={false}
          error={undefined}
          emptyMessage="No recently played songs"
          useLocalStorage={true}
          onAddToPlaylist={handleAddToPlaylist}
        />
      </div>
      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={() => {
          setShowAddToPlaylistModal(false);
          setSelectedSong(null);
        }}
        song={selectedSong!}
        onAddToPlaylist={handleAddToPlaylistSubmit}
      />
    </div>
  );
}
