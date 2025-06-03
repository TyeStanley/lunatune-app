'use client';

import { Music, ArrowLeft, Moon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { SongsList } from '@/components/SongsList';
import { useGetPlaylistQuery, useAddSongToPlaylistMutation } from '@/redux/api/playlistApi';
import AddToPlaylistModal from '@/components/library/AddToPlaylistModal';
import { useState } from 'react';
import type { Song } from '@/types/song';

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const { data: playlist, isLoading, error } = useGetPlaylistQuery(playlistId);
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();

  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setShowAddToPlaylistModal(true);
  };

  const handleAddToPlaylistSubmit = async (playlistId: string) => {
    if (!selectedSong) return;
    await addSongToPlaylist({ playlistId, songId: selectedSong.id });
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="animate-fadeIn text-center">
            <div className="mb-4">
              <div className="bg-background-lighter border-background-lighter mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-lg border">
                <Moon size={48} className="text-primary animate-pulse" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-200">Loading playlist...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="py-8 text-center text-red-500">
          Error loading playlist. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Playlists
        </button>
        <PageHeader icon={Music} title={playlist.name} />
      </div>

      <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
        {playlist.songs && playlist.songs.length > 0 ? (
          <SongsList
            songs={playlist.songs}
            currentPage={1}
            isLoading={isLoading}
            isFetching={false}
            useLocalStorage={true}
            onAddToPlaylist={handleAddToPlaylist}
          />
        ) : (
          <div className="py-8 text-center text-gray-400">No songs in this playlist yet.</div>
        )}
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
