'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  pause,
  play,
  toggleShuffle,
  toggleRepeat,
  setSeekTime,
} from '@/redux/state/playback-controls/playbackControlsSlice';
import { skipForward, skipBack } from '@/redux/state/queue/queueSlice';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle } from 'lucide-react';
import Slider from '../ui/Slider';
import { formatTime } from '@/lib/utils/time';

export default function PlayerControls() {
  const dispatch = useAppDispatch();
  const { isPlaying, progress, isShuffled, isRepeating, maxDuration } = useAppSelector(
    (state) => state.playbackControls,
  );
  const { upcomingSongs, playedSongs } = useAppSelector((state) => state.queue);

  const handleProgressChange = (value: number) => {
    dispatch(setSeekTime(value));
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
        <button
          className={controlButtonClass(false)}
          onClick={() => dispatch(skipBack())}
          disabled={!playedSongs.length}
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          className="cursor-pointer rounded-full bg-gray-200 p-2 transition hover:scale-105 hover:bg-white"
          onClick={() => {
            if (isPlaying) {
              dispatch(pause());
            } else {
              dispatch(play());
            }
          }}
        >
          {isPlaying ? (
            <Pause className="text-background h-5 w-5" />
          ) : (
            <Play className="text-background h-5 w-5" />
          )}
        </button>
        <button
          className={controlButtonClass(false)}
          onClick={() => dispatch(skipForward())}
          disabled={!upcomingSongs.length}
        >
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
        seekOnDrag={false}
      />
    </div>
  );
}
