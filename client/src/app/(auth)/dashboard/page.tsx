'use client';

import { useAuth } from '@/hooks/useAuth';

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else if (hour < 21) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const greeting = getGreeting();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-6 text-2xl font-semibold text-gray-200">
          {greeting}, {user?.name || 'User'}
        </h1>
      </div>

      {/* Recent Plays */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-gray-200">Recent Plays</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2].map((track) => (
            <div
              key={track}
              className="bg-background-lighter group hover:bg-background-light flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors"
            >
              <div className="bg-background-light h-12 w-12 rounded">
                {/* Album art placeholder */}
              </div>
              <div>
                <p className="group-hover:text-primary text-gray-200">Track {track}</p>
                <p className="text-sm text-gray-400">Artist</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Favorites */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-200">Your Favorites</h2>
        <div className="bg-background-lighter rounded-lg">
          <div className="group hover:bg-background-light flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-colors">
            <div className="bg-background-light h-12 w-12 rounded">
              {/* Playlist cover placeholder */}
            </div>
            <div>
              <p className="group-hover:text-primary text-gray-200">Liked Songs Playlist</p>
              <p className="text-sm text-gray-400">0 songs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
