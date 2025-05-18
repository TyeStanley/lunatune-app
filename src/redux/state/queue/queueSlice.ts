import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store';
import { pause } from '../playback-controls/playbackControlsSlice';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

interface QueueState {
  currentSong: Song | null;
  upcomingSongs: Song[];
  playedSongs: Song[];
}

const initialState: QueueState = {
  currentSong: null,
  upcomingSongs: [],
  playedSongs: [],
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    addToUpcoming: (state, action: PayloadAction<Song>) => {
      state.upcomingSongs.push(action.payload);
    },
    addToUpcomingStart: (state, action: PayloadAction<Song>) => {
      state.upcomingSongs.unshift(action.payload);
    },
    removeFromUpcoming: (state, action: PayloadAction<number>) => {
      state.upcomingSongs.splice(action.payload, 1);
    },
    addToPlayed: (state, action: PayloadAction<Song>) => {
      state.playedSongs.push(action.payload);
    },
    removeFromPlayed: (state, action: PayloadAction<number>) => {
      state.playedSongs.splice(action.payload, 1);
    },
    clearQueue: (state) => {
      state.currentSong = null;
      state.upcomingSongs = [];
      state.playedSongs = [];
    },
  },
});

export const {
  setCurrentSong,
  addToUpcoming,
  addToUpcomingStart,
  removeFromUpcoming,
  addToPlayed,
  removeFromPlayed,
  clearQueue,
} = queueSlice.actions;

// Thunk actions
export const playSong =
  (song: Song): AppThunk =>
  async (dispatch, getState) => {
    const { currentSong } = getState().queue;

    // If there's a current song, add it to played songs
    if (currentSong) {
      dispatch(addToPlayed(currentSong));
    }

    // Set the new song as current
    dispatch(setCurrentSong(song));
  };

export const skipForward = (): AppThunk => async (dispatch, getState) => {
  const { currentSong, upcomingSongs } = getState().queue;

  if (!upcomingSongs.length || !currentSong) {
    dispatch(pause()); // Pause playback if there are no next songs
    return;
  }

  // Add current song to played songs
  dispatch(addToPlayed(currentSong));

  // Get and remove the next song from upcoming
  const nextSong = upcomingSongs[0];
  dispatch(removeFromUpcoming(0));

  // Set it as current and start playing
  dispatch(setCurrentSong(nextSong));
};

export const skipBack = (): AppThunk => async (dispatch, getState) => {
  const { currentSong, playedSongs } = getState().queue;

  if (!playedSongs.length || !currentSong) return;

  // Add current song to the start of upcoming songs
  dispatch(addToUpcomingStart(currentSong));

  // Get and remove the last played song
  const previousSong = playedSongs[playedSongs.length - 1];
  dispatch(removeFromPlayed(playedSongs.length - 1));

  // Set it as current and start playing
  dispatch(setCurrentSong(previousSong));
};

export default queueSlice.reducer;
