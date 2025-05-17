'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  pause,
  setProgress,
  setMaxDuration,
  clearSeekTime,
} from '@/redux/state/playback-controls/playbackControlsSlice';
import { skipForward } from '@/redux/state/queue/queueSlice';
import { useGetStreamUrlQuery } from '@/redux/api/songApi';

export default function AudioPlayer() {
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const currentStreamUrlRef = useRef<string | null>(null);
  const dispatch = useAppDispatch();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { currentSong } = useAppSelector((state) => state.queue);
  const { isPlaying, isRepeating, volume, seekTime } = useAppSelector(
    (state) => state.playbackControls,
  );

  // Get the stream url for the current song
  const { data: streamData } = useGetStreamUrlQuery(currentSong?.id ?? '', {
    skip: !currentSong?.id,
  });
  console.log('audio1', audioRef1.current?.currentTime);
  console.log('audio2', audioRef2.current?.currentTime);

  // Set audio src when song changes
  useEffect(() => {
    if (!audioRef1.current || !audioRef2.current || !currentSong || !streamData?.streamUrl) return;

    const isNewSong = currentSongIdRef.current !== currentSong.id;
    const isNewStreamUrl = currentStreamUrlRef.current !== streamData.streamUrl;

    if (isNewSong || isNewStreamUrl) {
      currentSongIdRef.current = currentSong.id;
      currentStreamUrlRef.current = streamData.streamUrl;

      // Determine which audio element to use for the next song
      const currentAudio = currentAudioRef.current || audioRef1.current;
      const nextAudio = currentAudio === audioRef1.current ? audioRef2.current : audioRef1.current;

      // Set up the next audio element
      nextAudio.src = streamData.streamUrl;
      nextAudio.volume = 0;

      const handleLoadedMetadata = () => {
        setIsTransitioning(true);
        dispatch(setMaxDuration(nextAudio.duration));
        dispatch(setProgress(0));

        if (isPlaying) {
          // Start playing the next audio at volume 0
          nextAudio.play().catch(() => dispatch(pause()));

          // Crossfade between the two audio elements
          const fadeOutInterval = setInterval(() => {
            if (currentAudio.volume > 0) {
              currentAudio.volume = Math.max(0, currentAudio.volume - 0.1);
            }
          }, 50);

          const fadeInInterval = setInterval(() => {
            if (nextAudio.volume < volume) {
              nextAudio.volume = Math.min(volume, nextAudio.volume + 0.1);
            }
          }, 50);

          // After crossfade is complete
          setTimeout(() => {
            clearInterval(fadeOutInterval);
            clearInterval(fadeInInterval);
            currentAudio.currentTime = 0;
            currentAudioRef.current = nextAudio;
            nextAudioRef.current = currentAudio;
            setIsTransitioning(false);
          }, 1000);
        }
      };

      nextAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => nextAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [currentSong, streamData?.streamUrl, dispatch, isPlaying, volume]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef1.current || !currentSong) return;

    const currentAudio = currentAudioRef.current || audioRef1.current;

    if (isPlaying) {
      currentAudio.play().catch(() => dispatch(pause()));
    } else {
      currentAudio.pause();
    }
  }, [isPlaying, currentSong, dispatch]);

  // Handle seek requests
  useEffect(() => {
    if (!audioRef1.current || seekTime === null) return;

    const currentAudio = currentAudioRef.current || audioRef1.current;

    currentAudio.currentTime = seekTime;

    dispatch(clearSeekTime());
  }, [seekTime, dispatch]);

  // Update progress slider as song plays
  useEffect(() => {
    if (!audioRef1.current || !audioRef2.current) return;
    // Prevent progress updates during song transition for smoother experience
    if (isTransitioning) return;

    const currentAudio = currentAudioRef.current || audioRef1.current;

    const handleTimeUpdate = () => {
      dispatch(setProgress(currentAudio.currentTime));
    };

    currentAudio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [dispatch, isTransitioning]);

  // Handle song ending
  useEffect(() => {
    if (!audioRef1.current || !audioRef2.current) return;

    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;

    const handleEnded = () => {
      const currentAudio = currentAudioRef.current || audio1;

      if (isRepeating) {
        currentAudio.play();
        return;
      }
      dispatch(skipForward());
    };

    audio1.addEventListener('ended', handleEnded);
    audio2.addEventListener('ended', handleEnded);

    return () => {
      audio1.removeEventListener('ended', handleEnded);
      audio2.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating, dispatch]);

  // Handle volume
  useEffect(() => {
    if (!audioRef1.current) return;

    const currentAudio = currentAudioRef.current || audioRef1.current;
    currentAudio.volume = volume;
  }, [volume]);

  return (
    <>
      <audio ref={audioRef1} preload="auto" crossOrigin="anonymous" />
      <audio ref={audioRef2} preload="auto" crossOrigin="anonymous" />
    </>
  );
}
