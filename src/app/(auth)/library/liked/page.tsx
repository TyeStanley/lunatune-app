'use client';

import TrackItem from '@/components/TrackItem';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  durationMs: number;
}

// Temporary mock data - will be replaced with real data later
const mockSongs: Song[] = [
  {
    id: '1',
    title: "Can't Take My Eyes off You",
    artist: 'Frankie Valli',
    album: 'Frankie Valli Gold',
    dateAdded: new Date(2024, 2, 15).toISOString(),
    durationMs: 203000, // 3:23 in milliseconds
  },
  {
    id: '2',
    title: 'Sweet Dreams',
    artist: 'Eurythmics',
    album: 'Sweet Dreams (Are Made of This)',
    dateAdded: new Date(2024, 2, 14).toISOString(),
    durationMs: 216000, // 3:36 in milliseconds
  },
];

export default function LikedSongs() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200">Your Liked Songs</h1>
      </div>

      {/* Songs List */}
      <div className="bg-background-lighter rounded-lg">
        {mockSongs.map((song, index) => (
          <TrackItem
            key={song.id}
            index={index}
            id={song.id}
            title={song.title}
            artist={song.artist}
            album={song.album}
            dateAdded={song.dateAdded}
            durationMs={song.durationMs}
            isLiked={true}
          />
        ))}
      </div>
    </div>
  );
}
