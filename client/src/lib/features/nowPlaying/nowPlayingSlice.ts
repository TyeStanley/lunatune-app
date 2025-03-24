import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface NowPlayingState {
  currentSong: Song | null;
  isPlaying: boolean;
}

const initialState: NowPlayingState = {
  currentSong: null,
  isPlaying: false,
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
      state.isPlaying = true;
    },
  },
});

export const { playSong, pauseSong, resumeSong } = nowPlayingSlice.actions;
export default nowPlayingSlice.reducer;
