'use client';

import { createContext, useContext, ReactNode, RefObject } from 'react';

interface AudioContextType {
  currentAudioRef: RefObject<HTMLAudioElement | null>;
  audioRef1: RefObject<HTMLAudioElement | null>;
  audioRef2: RefObject<HTMLAudioElement | null>;
  source1: MediaElementAudioSourceNode | null;
  source2: MediaElementAudioSourceNode | null;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

interface AudioProviderProps {
  children: ReactNode;
  currentAudioRef: RefObject<HTMLAudioElement | null>;
  audioRef1: RefObject<HTMLAudioElement | null>;
  audioRef2: RefObject<HTMLAudioElement | null>;
  source1: MediaElementAudioSourceNode | null;
  source2: MediaElementAudioSourceNode | null;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
}

export default function AudioProvider({
  children,
  currentAudioRef,
  audioRef1,
  audioRef2,
  source1,
  source2,
  audioContext,
  analyser,
}: AudioProviderProps) {
  return (
    <AudioContext.Provider
      value={{
        currentAudioRef,
        audioRef1,
        audioRef2,
        source1,
        source2,
        audioContext,
        analyser,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
