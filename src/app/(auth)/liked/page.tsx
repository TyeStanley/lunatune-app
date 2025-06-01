'use client';

import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetLikedSongsQuery } from '@/redux/api/songApi';
import { PageHeader } from '@/components/PageHeader';
import { SongsList } from '@/components/SongsList';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useRouter, useSearchParams } from 'next/navigation';
import AddToPlaylistModal from '@/components/library/AddToPlaylistModal';
import { useAddSongToPlaylistMutation } from '@/redux/api/playlistApi';
import type { Song } from '@/types/song';

export default function LikedSongs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
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

  const { data, isLoading, isFetching, error } = useGetLikedSongsQuery(
    {
      searchTerm: debouncedSearchQuery,
      page: currentPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const songs = data?.songs || [];
  const totalPages = data?.totalPages || 1;

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
      <PageHeader icon={Heart} title="Your Liked Songs" />

      <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
        <div className="mb-4 flex flex-col items-stretch gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search your liked songs"
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
          songs={songs}
          currentPage={currentPage}
          isLoading={isLoading}
          isFetching={isFetching}
          error={error as Error}
          emptyMessage="You haven't liked any songs yet."
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
