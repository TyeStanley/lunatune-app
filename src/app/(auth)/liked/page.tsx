'use client';

import TrackItem from '@/components/TrackItem';
import { Heart, Clock } from 'lucide-react';
import { useGetLikedSongsQuery } from '@/redux/api/songApi';

export default function LikedSongs() {
  const { data: likedSongs, isLoading, isError } = useGetLikedSongsQuery();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Heart size={28} className="text-primary" />
            <h1 className="text-2xl font-semibold text-gray-200">Your Liked Songs</h1>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <section>
        <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading your liked songs...</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-400">Failed to load liked songs.</p>
            </div>
          ) : likedSongs && likedSongs.length > 0 ? (
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr className="text-left text-gray-400">
                  <th className="pb-2 text-center">#</th>
                  <th className="pb-2">Title</th>
                  <th className="hidden pb-2 sm:table-cell">Album</th>
                  <th className="hidden pb-2 md:table-cell">Date added</th>
                  <th className="flex justify-center pb-2">
                    <Clock size={18} className="text-gray-400" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {likedSongs.map((song, index) => (
                  <TrackItem
                    key={song.id}
                    index={index}
                    id={song.id}
                    title={song.title}
                    artist={song.artist}
                    album={song.album ?? ''}
                    dateAdded={song.createdAt}
                    durationMs={song.durationMs}
                    isLiked={song.isLiked ?? true}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">You haven&#39;t liked any songs yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
