'use client';

import { Play, Heart, Pause, Plus, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { pause, play } from '@/redux/state/playback-controls/playbackControlsSlice';
import { getRelativeTime } from '@/lib/utils/date';
import { formatDuration } from '@/lib/utils/duration';
import { playSong, addToUpcoming } from '@/redux/state/queue/queueSlice';
import { DropdownMenu } from './ui/DropdownMenu';
import { useLikeSongMutation, useUnlikeSongMutation } from '@/redux/api/songApi';
import { useState, useEffect } from 'react';

interface TrackItemProps {
  index: number;
  id: string;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  durationMs: number;
  isLiked: boolean;
  likeCount: number;
}

export default function TrackItem({
  index,
  id,
  title,
  artist,
  album,
  dateAdded,
  durationMs,
  isLiked: initialIsLiked,
  likeCount,
}: TrackItemProps) {
  const dispatch = useAppDispatch();
  const { currentSong } = useAppSelector((state) => state.queue);
  const { isPlaying } = useAppSelector((state) => state.playbackControls);
  const [likeSong, { isLoading: isLiking }] = useLikeSongMutation();
  const [unlikeSong, { isLoading: isUnliking }] = useUnlikeSongMutation();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const isCurrentSong = currentSong?.id === id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;
  const isMutating = isLiking || isUnliking;

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

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

  const handleLikeClick = async () => {
    setIsLiked(!isLiked);

    try {
      if (!isLiked) {
        await likeSong(id).unwrap();
      } else {
        await unlikeSong(id).unwrap();
      }
    } catch (error) {
      setIsLiked(isLiked);
      console.error('Failed to update like status:', error);
    }
  };

  const menuItems = [
    {
      label: 'Add to Queue',
      icon: <Plus />,
      onClick: handleAddToQueue,
    },
  ];

  return (
    <tr
      className={
        `group hover:from-background-lighter/20 hover:to-primary/30 focus-within:from-background-lighter focus-within:to-primary/30 relative transition-all duration-300 ease-in-out focus-within:bg-gradient-to-l hover:bg-gradient-to-l` +
        (isCurrentSong ? ' from-background-lighter/20 to-primary/30 bg-gradient-to-l' : '')
      }
      tabIndex={0}
      onDoubleClick={handlePlayClick}
    >
      {/* Track Number/Play Button Area */}
      <td className="relative w-14 min-w-10 py-4 text-center">
        <span className="text-base text-gray-400 group-focus-within:invisible group-hover:invisible">
          {index + 1}
        </span>
        <button
          className="hover:text-primary invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 group-focus-within:visible group-hover:visible"
          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          onClick={handlePlayClick}
        >
          {isCurrentlyPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </td>

      {/* Album Art & Song Title & Artist Info */}
      <td>
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 flex h-9 w-9 items-center justify-center rounded">
            <Moon size={22} className="text-primary" />
          </div>

          <div>
            <h3 className="truncate text-base font-normal text-gray-200">{title}</h3>
            <p className="truncate text-sm text-gray-400">{artist}</p>
          </div>
        </div>
      </td>

      {/* Album Name */}
      <td className="hidden truncate text-sm text-gray-400 sm:table-cell">{album}</td>

      {/* Date Added */}
      <td className="hidden truncate text-sm text-gray-400 md:table-cell">
        {getRelativeTime(dateAdded)}
      </td>

      {/* Like Count */}
      <td className="">
        <button
          className={`hover:text-primary inline-flex cursor-pointer items-center justify-center gap-1 ${isLiked ? 'text-primary' : 'text-yellow-400'}`}
          onClick={handleLikeClick}
          disabled={isMutating}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-gray-200">{likeCount}</span>
        </button>
      </td>

      {/* Action Buttons and Duration */}
      <td className="w-10 space-x-4 px-2">
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-gray-400">{formatDuration(durationMs)}</span>
          <DropdownMenu items={menuItems} />
        </div>
      </td>
    </tr>
  );
}
