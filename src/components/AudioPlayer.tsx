'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setProgress,
  setMaxDuration,
  clearSeekTime,
  play,
} from '@/redux/state/playback-controls/playbackControlsSlice';
import { skipForward } from '@/redux/state/queue/queueSlice';
import { useGetStreamUrlQuery } from '@/redux/api/songApi';

export default function AudioPlayer() {
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const currentStreamUrlRef = useRef<string | null>(null);
  const dispatch = useAppDispatch();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [songEnded, setSongEnded] = useState(false);
  const { currentSong, upcomingSongs } = useAppSelector((state) => state.queue);
  const { isPlaying, isRepeating, volume, seekTime } = useAppSelector(
    (state) => state.playbackControls,
  );

  // Get the stream url for the current song
  const { data: streamData } = useGetStreamUrlQuery(currentSong?.id ?? '', {
    skip: !currentSong?.id,
  });

  // Set audio src when song changes
  useEffect(() => {
    if (!audioRef1.current || !audioRef2.current || !currentSong || !streamData?.streamUrl) return;

    const isNewSong = currentSongIdRef.current !== currentSong.id;
    const isNewStreamUrl = currentStreamUrlRef.current !== streamData.streamUrl;
    const isFirstLoad = !currentAudioRef.current;

    if (isNewSong || isNewStreamUrl) {
      currentSongIdRef.current = currentSong.id;
      currentStreamUrlRef.current = streamData.streamUrl;

      // For first load, always use audioRef1
      if (isFirstLoad) {
        const audio1 = audioRef1.current;
        if (!audio1) return;

        audio1.src = streamData.streamUrl;
        audio1.volume = volume;
        currentAudioRef.current = audio1;

        const handleFirstLoad = () => {
          dispatch(setMaxDuration(audio1.duration));
          dispatch(setProgress(0));
          dispatch(play());
        };

        audio1.addEventListener('loadedmetadata', handleFirstLoad);
        return () => audio1.removeEventListener('loadedmetadata', handleFirstLoad);
      }

      // For subsequent loads, use the crossfade logic
      const currentAudio = currentAudioRef.current || audioRef1.current;
      const nextAudio = currentAudio === audioRef1.current ? audioRef2.current : audioRef1.current;

      // Set up the next audio element
      nextAudio.src = streamData.streamUrl;
      nextAudio.volume = 0;

      const handleLoadedMetadata = () => {
        setIsTransitioning(true);
        dispatch(setMaxDuration(nextAudio.duration));
        dispatch(setProgress(0));

        if (isPlaying && !songEnded) {
          // Start playing the next audio at volume 0
          nextAudio.play();

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
            currentAudio.src = '';
            currentAudioRef.current = nextAudio;
            setIsTransitioning(false);
            setSongEnded(false);
          }, 1000);
        } else {
          // If paused or song ended, switch to next song silently and start playing
          setTimeout(() => {
            nextAudio.volume = volume;
            nextAudio.play();
            dispatch(play());
            setIsTransitioning(false);
            setSongEnded(false);
            currentAudio.src = '';
            currentAudioRef.current = nextAudio;
          }, 1000);
        }
      };

      nextAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => nextAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [currentSong, streamData?.streamUrl, dispatch, isPlaying, volume, songEnded]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef1.current || !currentSong) return;

    const currentAudio = currentAudioRef.current || audioRef1.current;

    if (isPlaying) {
      currentAudio.play();
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

      setSongEnded(true);
      dispatch(skipForward());
    };

    audio1.addEventListener('ended', handleEnded);
    audio2.addEventListener('ended', handleEnded);

    return () => {
      audio1.removeEventListener('ended', handleEnded);
      audio2.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating, dispatch, songEnded, upcomingSongs.length]);

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
