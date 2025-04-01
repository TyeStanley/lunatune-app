import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlaybackControlsState {
  isPlaying: boolean;
  progress: number;
  maxDuration: number;
  volume: number;
  isShuffled: boolean;
  isRepeating: boolean;
  seekTime: number | null;
}

const initialState: PlaybackControlsState = {
  isPlaying: false,
  progress: 0,
  maxDuration: 0,
  volume: 1,
  isShuffled: false,
  isRepeating: false,
  seekTime: null,
};

export const playbackControlsSlice = createSlice({
  name: 'playbackControls',
  initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = Math.max(0, Math.min(action.payload, state.maxDuration));
    },
    setMaxDuration: (state, action: PayloadAction<number>) => {
      state.maxDuration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    toggleRepeat: (state) => {
      state.isRepeating = !state.isRepeating;
    },
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },
    setSeekTime: (state, action: PayloadAction<number | null>) => {
      state.seekTime = action.payload;
    },
    clearSeekTime: (state) => {
      state.seekTime = null;
    },
  },
});

export const {
  play,
  pause,
  setProgress,
  setMaxDuration,
  setVolume,
  toggleRepeat,
  toggleShuffle,
  setSeekTime,
  clearSeekTime,
} = playbackControlsSlice.actions;

export default playbackControlsSlice.reducer;
