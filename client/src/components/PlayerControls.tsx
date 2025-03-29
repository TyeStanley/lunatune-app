'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  pauseSong,
  resumeSong,
  toggleShuffle,
  toggleRepeat,
  seekToTime,
} from '@/lib/features/nowPlaying/nowPlayingSlice';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle } from 'lucide-react';
import Slider from './ui/Slider';
import { formatTime } from '@/utils/time';

export default function PlayerControls() {
  const dispatch = useAppDispatch();
  const { isPlaying, progress, isShuffled, isRepeating, maxDuration } = useAppSelector(
    (state) => state.nowPlaying,
  );

  const handleProgressChange = (value: number) => {
    dispatch(seekToTime(value));
  };

  const controlButtonClass = (isActive: boolean) =>
    `cursor-pointer transition-colors ${
      isActive ? 'text-primary hover:text-primary/80' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex items-center gap-6">
        <button
          className={controlButtonClass(isShuffled)}
          onClick={() => dispatch(toggleShuffle())}
        >
          <Shuffle className="h-5 w-5" />
        </button>
        <button className={controlButtonClass(false)}>
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          className="cursor-pointer rounded-full bg-gray-200 p-2 transition hover:scale-105 hover:bg-white"
          onClick={() => {
            if (isPlaying) {
              dispatch(pauseSong());
            } else {
              dispatch(resumeSong());
            }
          }}
        >
          {isPlaying ? (
            <Pause className="text-background h-5 w-5" />
          ) : (
            <Play className="text-background h-5 w-5" />
          )}
        </button>
        <button className={controlButtonClass(false)}>
          <SkipForward className="h-5 w-5" />
        </button>
        <button
          className={controlButtonClass(isRepeating)}
          onClick={() => dispatch(toggleRepeat())}
        >
          <Repeat className="h-5 w-5" />
        </button>
      </div>
      <Slider
        value={progress}
        max={maxDuration}
        onChange={handleProgressChange}
        formatLabel={formatTime}
        showLabels
      />
    </div>
  );
}
