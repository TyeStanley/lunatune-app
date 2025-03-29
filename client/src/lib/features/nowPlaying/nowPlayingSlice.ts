import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

interface NowPlayingState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  maxDuration: number;
  volume: number;
  isShuffled: boolean;
  isRepeating: boolean;
  seekTime: number | null;
}

const initialState: NowPlayingState = {
  currentSong: null,
  isPlaying: false,
  progress: 0,
  maxDuration: 0,
  volume: 1,
  isShuffled: false,
  isRepeating: false,
  seekTime: null,
};

export const nowPlayingSlice = createSlice({
  name: 'nowPlaying',
  initialState,
  reducers: {
    playSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    pauseSong: (state) => {
      state.isPlaying = false;
    },
    resumeSong: (state) => {
      if (state.currentSong && state.progress < state.currentSong.duration) {
        state.isPlaying = true;
      }
    },
    setProgress: (state, action: PayloadAction<number>) => {
      if (state.currentSong) {
        state.progress = Math.max(0, Math.min(action.payload, state.currentSong.duration));
      }
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(action.payload, 100));
    },
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },
    toggleRepeat: (state) => {
      state.isRepeating = !state.isRepeating;
    },
    setMaxDuration: (state, action: PayloadAction<number>) => {
      state.maxDuration = action.payload;
    },
    seekToTime: (state, action: PayloadAction<number>) => {
      state.seekTime = action.payload;
    },
    clearSeekTime: (state) => {
      state.seekTime = null;
    },
  },
});

export const {
  playSong,
  pauseSong,
  resumeSong,
  setProgress,
  setVolume,
  toggleShuffle,
  toggleRepeat,
  setMaxDuration,
  seekToTime,
  clearSeekTime,
} = nowPlayingSlice.actions;

export default nowPlayingSlice.reducer;
