import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store';
import { pause } from '../playback-controls/playbackControlsSlice';
import { Song } from '@/types/song';

const PLAYED_SONGS_STORAGE_KEY = 'lunatune_played_songs';
const MAX_HISTORY_LENGTH = 50;

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
      state.playedSongs.unshift(action.payload);
    },
    removeFromPlayed: (state, action: PayloadAction<number>) => {
      state.playedSongs.splice(action.payload, 1);
    },
    clearQueue: (state) => {
      state.currentSong = null;
      state.upcomingSongs = [];
      state.playedSongs = [];
    },
    setQueueFromPlaylist: (
      state,
      action: PayloadAction<{ currentSong: Song; previousSongs: Song[]; upcomingSongs: Song[] }>,
    ) => {
      state.currentSong = action.payload.currentSong;
      state.playedSongs = action.payload.previousSongs;
      state.upcomingSongs = action.payload.upcomingSongs;
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
  setQueueFromPlaylist,
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

    // Get existing played songs from local storage and add current song at the beginning
    const existingPlayedSongs = JSON.parse(localStorage.getItem(PLAYED_SONGS_STORAGE_KEY) || '[]');
    // Filter out the current song if it exists in the history
    const filteredHistory = existingPlayedSongs.filter((s: Song) => s.id !== song.id);
    // Keep only the most recent MAX_HISTORY_LENGTH songs
    const updatedHistory = [song, ...filteredHistory].slice(0, MAX_HISTORY_LENGTH);
    localStorage.setItem(PLAYED_SONGS_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

export const playSongFromPlaylist =
  (song: Song, playlistSongs: Song[]): AppThunk =>
  (dispatch) => {
    const currentIndex = playlistSongs.findIndex((s) => s.id === song.id);
    if (currentIndex === -1) return;

    const previousSongs = playlistSongs.slice(0, currentIndex).reverse();
    const upcomingSongs = playlistSongs.slice(currentIndex + 1);

    dispatch(
      setQueueFromPlaylist({
        currentSong: song,
        previousSongs,
        upcomingSongs,
      }),
    );

    // Get existing played songs from local storage
    const existingPlayedSongs = JSON.parse(localStorage.getItem(PLAYED_SONGS_STORAGE_KEY) || '[]');

    // Filter out any songs that are in the current playlist from localStorage
    const filteredHistory = existingPlayedSongs.filter(
      (s: Song) => !playlistSongs.some((playlistSong) => playlistSong.id === s.id),
    );

    // Put playlist songs first (most recent) followed by filtered history
    const updatedHistory = [song, ...previousSongs, ...filteredHistory].slice(
      0,
      MAX_HISTORY_LENGTH,
    );
    localStorage.setItem(PLAYED_SONGS_STORAGE_KEY, JSON.stringify(updatedHistory));
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

  // Get existing played songs from local storage and add current song at the beginning
  const existingPlayedSongs = JSON.parse(localStorage.getItem(PLAYED_SONGS_STORAGE_KEY) || '[]');
  // Filter out the current song if it exists in the history
  const filteredHistory = existingPlayedSongs.filter((s: Song) => s.id !== currentSong.id);
  // Keep only the most recent MAX_HISTORY_LENGTH songs
  const updatedHistory = [currentSong, ...filteredHistory].slice(0, MAX_HISTORY_LENGTH);
  localStorage.setItem(PLAYED_SONGS_STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const skipBack = (): AppThunk => async (dispatch, getState) => {
  const { currentSong, playedSongs } = getState().queue;

  if (!playedSongs.length || !currentSong) return;

  // Add current song to the start of upcoming songs
  dispatch(addToUpcomingStart(currentSong));

  // Get and remove the last played song
  const previousSong = playedSongs[0];
  dispatch(removeFromPlayed(0));

  // Set it as current and start playing
  dispatch(setCurrentSong(previousSong));
};

export default queueSlice.reducer;
