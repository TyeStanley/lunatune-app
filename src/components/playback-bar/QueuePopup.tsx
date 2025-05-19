'use client';

import { useAppSelector } from '@/redux/hooks';
import { useState } from 'react';
import QueueItem from './QueueItem';

interface QueuePopupProps {
  isOpen: boolean;
}

export default function QueuePopup({ isOpen }: QueuePopupProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'recent'>('queue');
  const { currentSong, upcomingSongs } = useAppSelector((state) => state.queue);
  const { playedSongs } = useAppSelector((state) => state.queue);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 bottom-full w-96">
      <div className="bg-background-lighter/20 rounded-tl-lg border border-white/5 p-4 backdrop-blur-md">
        {/* Tabs */}
        <div className="mb-4 flex gap-4 border-b border-white/5">
          <button
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'queue'
                ? 'border-primary text-primary border-b-2'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('queue')}
          >
            Queue
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'border-primary text-primary border-b-2'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recently Played
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[60vh] overflow-y-auto">
          {activeTab === 'queue' ? (
            <div className="space-y-4">
              {/* Now Playing */}
              {currentSong && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-400">Now Playing</h3>
                  <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-2 backdrop-blur-sm">
                    <QueueItem title={currentSong.title} artist={currentSong.artist} />
                  </div>
                </div>
              )}

              {/* Up Next */}
              {upcomingSongs.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-400">Up Next</h3>
                  <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-2 backdrop-blur-sm">
                    {upcomingSongs.map((song) => (
                      <QueueItem key={song.id} title={song.title} artist={song.artist} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {playedSongs.length > 0 ? (
                <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-2 backdrop-blur-sm">
                  {playedSongs.map((song) => (
                    <QueueItem key={song.id} title={song.title} artist={song.artist} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No recently played songs</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
