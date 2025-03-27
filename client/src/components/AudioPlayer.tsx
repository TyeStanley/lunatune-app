'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { pauseSong, setProgress } from '@/lib/features/nowPlaying/nowPlayingSlice';

export default function AudioPlayer({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying } = useAppSelector((state) => state.nowPlaying);

  // Handle initial/new song load
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.url;
  }, [currentSong, audioRef]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => dispatch(pauseSong()));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong, dispatch, audioRef]);

  // Update progress slider as song plays
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      dispatch(setProgress(audio.currentTime));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [dispatch, audioRef]);

  return <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />;
}
