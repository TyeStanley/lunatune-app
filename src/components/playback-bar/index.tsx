'use client';

import { useAppSelector } from '@/redux/hooks';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import QueuePopup from './QueuePopup';
import { Moon, ListMusic } from 'lucide-react';
import { useState } from 'react';

export default function PlaybackBar() {
  const { currentSong } = useAppSelector((state) => state.queue);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  if (!currentSong) return null;

  return (
    <footer
      className={`${
        currentSong
          ? 'border-background-lighter bg-background fixed bottom-0 z-50 w-full border-t px-4 py-3'
          : 'hidden'
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center">
        {/* Left: Song Info */}
        <div className="flex w-[30%] items-center gap-4">
          <div className="bg-background-lighter flex h-14 w-14 items-center justify-center overflow-hidden rounded">
            <Moon size={50} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-normal text-gray-200">{currentSong?.title}</span>
            <span className="text-sm text-gray-400">{currentSong?.artist}</span>
          </div>
        </div>

        {/* Center: Player Controls */}
        <div className="max-w-[40%] flex-1">
          <PlayerControls />
        </div>

        {/* Right: Queue Button and Volume Control */}
        <section className="flex w-[30%] items-center justify-end gap-2">
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`hover:text-primary cursor-pointer text-gray-400 transition-colors ${
              isQueueOpen ? 'text-primary' : ''
            }`}
          >
            <ListMusic className="size-5" />
          </button>
          <QueuePopup isOpen={isQueueOpen} />
          <div className="flex items-center justify-end gap-4">
            <VolumeControl />
          </div>
        </section>
      </div>
    </footer>
  );
}
