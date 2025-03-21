import TrackItem from '@/components/TrackItem';

async function getSongs(): Promise<Song[]> {
  const res = await fetch('http://localhost:5133/api/songs', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch songs');
  }

  return res.json();
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  createdAt: string;
}

export default async function Home() {
  const songs = await getSongs();

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
            {songs.map((song: Song) => (
              <TrackItem
                key={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album}
                dateAdded={new Date(song.createdAt).toLocaleDateString()}
                duration={song.duration.substring(11, 4)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
