'use client';

import { useAppSelector } from '@/lib/hooks';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import AudioPlayer from './AudioPlayer';
import { useRef } from 'react';

export default function NowPlayingBar() {
  const { currentSong } = useAppSelector((state) => state.nowPlaying);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <AudioPlayer audioRef={audioRef} />
      {currentSong && (
        <footer
          className={`${
            currentSong
              ? 'border-background-lighter bg-background fixed bottom-0 w-full border-t px-4 py-3'
              : 'hidden'
          }`}
        >
          <div className="mx-auto flex max-w-screen-2xl items-center">
            {/* Left: Song Info */}
            <div className="flex w-[30%] items-center gap-4">
              <div className="bg-background-lighter h-14 w-14 overflow-hidden rounded">
                {/* Album art would go here */}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-normal text-gray-200">{currentSong?.title}</span>
                <span className="text-sm text-gray-400">{currentSong?.artist}</span>
              </div>
            </div>

            {/* Center: Player Controls */}
            <div className="flex-1">
              <PlayerControls audioRef={audioRef} />
            </div>

            {/* Right: Volume Control */}
            <div className="flex w-[30%] justify-end">
              <VolumeControl />
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
