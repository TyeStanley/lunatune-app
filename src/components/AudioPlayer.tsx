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
import AudioProvider from '@/providers/AudioProvider';

export default function AudioPlayer({ children }: { children: React.ReactNode }) {
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

  // Audio context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const source1Ref = useRef<MediaElementAudioSourceNode | null>(null);
  const source2Ref = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioRef1.current || !audioRef2.current) return;

    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Create source nodes for both audio elements
      try {
        const source1 = audioContext.createMediaElementSource(audioRef1.current);
        const source2 = audioContext.createMediaElementSource(audioRef2.current);

        source1.connect(analyser);
        source1.connect(audioContext.destination);
        source2.connect(analyser);
        source2.connect(audioContext.destination);

        source1Ref.current = source1;
        source2Ref.current = source2;
      } catch (error) {
        console.error('Error creating media element sources:', error);
      }
    }

    return () => {
      // Cleanup will happen when component unmounts
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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
    if (!audioRef1.current || !currentSong || !audioContextRef.current) return;

    const currentAudio = currentAudioRef.current || audioRef1.current;

    if (isPlaying) {
      // Resume audio context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
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
    <AudioProvider
      currentAudioRef={currentAudioRef}
      audioRef1={audioRef1}
      audioRef2={audioRef2}
      source1={source1Ref.current}
      source2={source2Ref.current}
      audioContext={audioContextRef.current}
      analyser={analyserRef.current}
    >
      {children}
      <audio ref={audioRef1} preload="auto" crossOrigin="anonymous" />
      <audio ref={audioRef2} preload="auto" crossOrigin="anonymous" />
    </AudioProvider>
  );
}
