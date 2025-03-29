'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  pauseSong,
  setProgress,
  setMaxDuration,
  clearSeekTime,
} from '@/lib/features/nowPlaying/nowPlayingSlice';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, isRepeating, volume, seekTime } = useAppSelector(
    (state) => state.nowPlaying,
  );

  // Handle initial/new song load
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    // Load the new song
    audio.src = currentSong.url;

    // Set the max duration of the new song for the slider
    const handleLoadedMetadata = () => {
      dispatch(setMaxDuration(audio.duration));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [currentSong, audioRef, dispatch]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch(() => dispatch(pauseSong()));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, dispatch, audioRef]);

  // Handle seek requests
  useEffect(() => {
    if (!audioRef.current || seekTime === null) return;
    const audio = audioRef.current;

    audio.currentTime = seekTime;
    dispatch(clearSeekTime());
  }, [seekTime, audioRef, dispatch]);

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

  // Handle repeat
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const handleEnded = () => {
      if (isRepeating) {
        audio.play();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [audioRef, isRepeating]);

  // Handle volume
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (volume > 0) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
  }, [audioRef, volume]);

  return <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />;
}
