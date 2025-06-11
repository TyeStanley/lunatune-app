'use client';

import { useAppSelector } from '@/redux/hooks';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import QueuePopup from './QueuePopup';
import { Moon, ListMusic } from 'lucide-react';
import { useState } from 'react';
import PlaybackVisualizer from './PlaybackVisualizer';
import { usePathname } from 'next/navigation';

export default function PlaybackBar() {
  const { currentSong } = useAppSelector((state) => state.queue);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const pathname = usePathname();

  if (!currentSong) return null;

  return (
    <>
      {pathname !== '/visualizer' && (
        <div className="fixed bottom-[136px] left-0 z-50 w-full md:bottom-[84px]">
          <PlaybackVisualizer />
        </div>
      )}
      <footer
        className={`${
          currentSong ? 'fixed bottom-0 z-50 w-full px-1 py-2 sm:px-2 md:py-3 lg:px-0' : 'hidden'
        } bg-background`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 sm:px-2 md:grid md:grid-cols-3 md:items-center md:gap-0 md:px-4 lg:px-8">
          {/* Top row for mobile: Song Info + Right Controls */}
          <div className="flex w-full items-center justify-between px-4 sm:px-2 md:col-span-1 md:mb-0 md:w-auto md:pr-4 md:pl-0 lg:pr-8 lg:pl-0">
            {/* Left: Song Info */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-background-lighter flex h-12 w-12 items-center justify-center overflow-hidden rounded">
                <Moon size={40} className="text-primary md:size-[50px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-normal text-gray-200 md:text-sm">
                  {currentSong?.title}
                </span>
                <span className="text-xs text-gray-400 md:text-sm">{currentSong?.artist}</span>
              </div>
            </div>
            {/* Right: Queue Button and Volume Control (mobile only, hidden on md+) */}
            <section className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsQueueOpen(!isQueueOpen)}
                className={`hover:text-primary cursor-pointer text-gray-400 transition-colors $${
                  isQueueOpen ? 'text-primary' : ''
                }`}
              >
                <ListMusic className={`size-5 ${isQueueOpen ? 'text-primary' : ''}`} />
              </button>
              <QueuePopup isOpen={isQueueOpen} />
              <div className="flex items-center gap-2">
                <VolumeControl />
              </div>
            </section>
          </div>

          {/* Center: Player Controls (full width on mobile, center column on md+) */}
          <div className="mb-1 flex w-full justify-center md:col-span-1 md:mb-0 md:justify-center">
            <PlayerControls />
          </div>

          {/* Right: Queue Button and Volume Control (md+ only) */}
          <section className="hidden w-[30%] items-center justify-end gap-2 md:col-span-1 md:flex md:justify-self-end">
            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              className="hover:text-primary cursor-pointer text-gray-400 transition-colors"
            >
              <ListMusic className={`size-5 ${isQueueOpen ? 'text-primary' : ''}`} />
            </button>
            <QueuePopup isOpen={isQueueOpen} />
            <div className="flex items-center justify-end gap-2 md:gap-4">
              <VolumeControl />
            </div>
          </section>
        </div>
      </footer>
    </>
  );
}
