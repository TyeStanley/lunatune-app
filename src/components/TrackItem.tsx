'use client';

import { Play, Heart, Pause, Plus, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { pause, play } from '@/redux/state/playback-controls/playbackControlsSlice';
import { getRelativeTime } from '@/lib/utils/date';
import { formatDuration } from '@/lib/utils/duration';
import { playSong, addToUpcoming } from '@/redux/state/queue/queueSlice';
import { DropdownMenu } from './ui/DropdownMenu';

interface TrackItemProps {
  index: number;
  id: string;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  durationMs: number;
}

export default function TrackItem({
  index,
  id,
  title,
  artist,
  album,
  dateAdded,
  durationMs,
}: TrackItemProps) {
  const dispatch = useAppDispatch();
  const { currentSong } = useAppSelector((state) => state.queue);
  const { isPlaying } = useAppSelector((state) => state.playbackControls);
  const isCurrentSong = currentSong?.id === id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        dispatch(pause());
      } else {
        dispatch(play());
      }
    } else {
      dispatch(
        playSong({
          id,
          title,
          artist,
          duration: durationMs,
        }),
      );
    }
  };

  const handleAddToQueue = () => {
    dispatch(
      addToUpcoming({
        id,
        title,
        artist,
        duration: durationMs,
      }),
    );
  };

  const menuItems = [
    {
      label: 'Add to Queue',
      icon: <Plus />,
      onClick: handleAddToQueue,
    },
  ];

  return (
    <div
      className={
        `group hover:from-background-lighter hover:to-primary/30 focus-within:from-background-lighter focus-within:to-primary/30 relative flex items-center rounded-md p-4 transition-all duration-300 ease-in-out focus-within:bg-gradient-to-l hover:bg-gradient-to-l` +
        (isCurrentSong ? ' from-background-lighter to-primary/30 bg-gradient-to-l' : '')
      }
      tabIndex={0}
      onDoubleClick={handlePlayClick}
    >
      {/* Track Number/Play Button Area */}
      <div className="mr-4 flex w-8 items-center justify-center">
        <span className="text-base text-gray-400 group-focus-within:hidden group-hover:hidden">
          {index + 1}
        </span>
        <button
          className="hover:text-primary hidden cursor-pointer text-gray-200 group-focus-within:block group-hover:block"
          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          onClick={handlePlayClick}
        >
          {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Album Art */}
      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded">
        <div className="bg-primary/20 flex h-9 w-9 items-center justify-center rounded">
          <Moon size={22} className="text-primary" />
        </div>
      </div>

      {/* Song Info */}
      <div className="flex flex-1 items-center">
        {/* Title and Artist */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-normal text-gray-200">{title}</h3>
          <p className="truncate text-sm text-gray-400">{artist}</p>
        </div>

        {/* Album Name */}
        <div className="hidden flex-1 px-4 text-sm text-gray-400 md:block">
          <p className="truncate">{album}</p>
        </div>

        {/* Date Added */}
        <div className="hidden w-32 text-sm text-gray-400 md:block">
          <p className="truncate">{getRelativeTime(dateAdded)}</p>
        </div>

        {/* Action Buttons and Duration */}
        <div className="flex items-center space-x-4">
          <button
            className="hover:text-primary invisible text-gray-400 group-focus-within:visible group-hover:visible"
            aria-label="Like"
          >
            <Heart size={18} />
          </button>
          <span className="text-sm text-gray-400">{formatDuration(durationMs)}</span>
          <DropdownMenu items={menuItems} />
        </div>
      </div>
    </div>
  );
}
