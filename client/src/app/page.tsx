import { musicService } from '@/services/musicService';
import TrackItem from '@/components/TrackItem';

export default async function Home() {
  const songs = await musicService.getSongs();

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search songs..."
            className="border-background-lighter bg-background-lighter focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-2 text-gray-200 placeholder-gray-400 focus:ring-1 focus:outline-none md:w-96"
          />
        </div>

        {/* Music List */}
        <div className="bg-background-light rounded-lg shadow-lg">
          <div>
            {songs.map((song, index) => (
              <TrackItem
                key={song.id}
                index={index}
                id={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album || ''}
                dateAdded={song.createdAt}
                durationMs={song.durationMs}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
