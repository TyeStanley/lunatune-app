import TrackItem from '@/components/TrackItem';

export default function Home() {
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
            <TrackItem
              title="Lay Low"
              artist="Tiësto"
              album="Lay Low"
              dateAdded="2 days ago"
              duration="2:33"
            />
            <TrackItem
              title="Hotel California"
              artist="Eagles"
              album="Something"
              dateAdded="5 days ago"
              duration="6:30"
            />
            <TrackItem
              title="Sweet Caroline"
              artist="Neil Diamond"
              album="Something"
              dateAdded="1 week ago"
              duration="3:23"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
