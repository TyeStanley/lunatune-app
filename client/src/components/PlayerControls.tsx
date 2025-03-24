'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  pauseSong,
  resumeSong,
  setProgress,
  toggleShuffle,
  toggleRepeat,
} from '@/lib/features/nowPlaying/nowPlayingSlice';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Slider from './ui/Slider';
import { formatTime } from '@/utils/time';

export default function PlayerControls() {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, progress, isShuffled, isRepeating } = useAppSelector(
    (state) => state.nowPlaying,
  );
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && currentSong) {
      intervalId = setInterval(() => {
        if (progressRef.current < currentSong.duration) {
          dispatch(setProgress(progressRef.current + 1));
        } else {
          dispatch(pauseSong());
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, currentSong, dispatch]);

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pauseSong());
    } else {
      dispatch(resumeSong());
    }
  };

  const handleShuffleClick = () => {
    dispatch(toggleShuffle());
  };

  const handleRepeatClick = () => {
    dispatch(toggleRepeat());
  };

  if (!currentSong) return null;

  const controlButtonClass = (isActive: boolean) =>
    `cursor-pointer transition-colors ${
      isActive ? 'text-primary hover:text-primary/80' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex items-center gap-6">
        <button onClick={handleShuffleClick} className={controlButtonClass(isShuffled)}>
          <Shuffle className="h-5 w-5" />
        </button>
        <button className={controlButtonClass(false)}>
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          onClick={handlePlayPause}
          className="cursor-pointer rounded-full bg-gray-200 p-2 transition hover:scale-105 hover:bg-white"
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
        <button onClick={handleRepeatClick} className={controlButtonClass(isRepeating)}>
          <Repeat className="h-5 w-5" />
        </button>
      </div>
      <Slider
        value={progress}
        max={currentSong.duration}
        onChange={(value) => dispatch(setProgress(value))}
        formatLabel={formatTime}
        showLabels
      />
    </div>
  );
}
