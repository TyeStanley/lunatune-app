'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setVolume } from '@/redux/state/playback-controls/playbackControlsSlice';
import { Volume1, Volume2, VolumeX } from 'lucide-react';
import Slider from '../ui/Slider';
import { useCallback, useState, useEffect } from 'react';

const VOLUME_STORAGE_KEY = 'lunatune-volume';

export default function VolumeControl() {
  const dispatch = useAppDispatch();
  const { volume } = useAppSelector((state) => state.playbackControls);
  const [previousVolume, setPreviousVolume] = useState(1);

  // Initialize volume from local storage on component mount
  useEffect(() => {
    const storedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (storedVolume !== null) {
      const parsedVolume = parseFloat(storedVolume);
      dispatch(setVolume(parsedVolume));
      setPreviousVolume(parsedVolume);
    }
  }, [dispatch]);

  const handleVolumeClick = useCallback(() => {
    if (volume > 0) {
      setPreviousVolume(volume);
      dispatch(setVolume(0));
      localStorage.setItem(VOLUME_STORAGE_KEY, '0');
    } else {
      dispatch(setVolume(previousVolume));
      localStorage.setItem(VOLUME_STORAGE_KEY, previousVolume.toString());
    }
  }, [volume, previousVolume, dispatch]);

  const handleVolumeChange = (value: number) => {
    dispatch(setVolume(value));
    localStorage.setItem(VOLUME_STORAGE_KEY, value.toString());
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="size-5" />;
    if (volume < 0.5) return <Volume1 className="size-5" />;
    return <Volume2 className="size-5" />;
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <button
        onClick={handleVolumeClick}
        className="hover:text-primary cursor-pointer text-gray-400 transition-colors"
      >
        {getVolumeIcon()}
      </button>
      <div className="w-[100px]">
        <Slider value={volume} max={1} onChange={handleVolumeChange} seekOnDrag={true} />
      </div>
    </div>
  );
}
