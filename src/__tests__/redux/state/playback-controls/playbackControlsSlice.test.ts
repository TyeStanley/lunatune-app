import {
  playbackControlsSlice,
  play,
  pause,
  setProgress,
  setMaxDuration,
  setVolume,
  toggleRepeat,
  toggleShuffle,
  setSeekTime,
  clearSeekTime,
  setSleepTimer,
  clearSleepTimer,
} from '@/redux/state/playback-controls/playbackControlsSlice';

describe('playbackControlsSlice', () => {
  const initialState = {
    isPlaying: false,
    progress: 0,
    maxDuration: 0,
    volume: 1,
    isShuffled: false,
    isRepeating: false,
    seekTime: null,
    sleepTimer: {
      isActive: false,
      endTime: null,
      duration: null,
    },
  };

  it('should return the initial state', () => {
    expect(playbackControlsSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle play and pause', () => {
    let state = playbackControlsSlice.reducer(initialState, play());
    expect(state.isPlaying).toBe(true);
    state = playbackControlsSlice.reducer(state, pause());
    expect(state.isPlaying).toBe(false);
  });

  it('should set progress and max duration', () => {
    let state = playbackControlsSlice.reducer(initialState, setMaxDuration(300));
    expect(state.maxDuration).toBe(300);
    state = playbackControlsSlice.reducer(state, setProgress(150));
    expect(state.progress).toBe(150);
    state = playbackControlsSlice.reducer(state, setProgress(400));
    expect(state.progress).toBe(300); // should not exceed maxDuration
    state = playbackControlsSlice.reducer(state, setProgress(-10));
    expect(state.progress).toBe(0); // should not go below 0
  });

  it('should set volume', () => {
    const state = playbackControlsSlice.reducer(initialState, setVolume(0.5));
    expect(state.volume).toBe(0.5);
  });

  it('should toggle repeat and shuffle', () => {
    let state = playbackControlsSlice.reducer(initialState, toggleRepeat());
    expect(state.isRepeating).toBe(true);
    state = playbackControlsSlice.reducer(state, toggleRepeat());
    expect(state.isRepeating).toBe(false);
    state = playbackControlsSlice.reducer(initialState, toggleShuffle());
    expect(state.isShuffled).toBe(true);
  });

  it('should set and clear seek time', () => {
    let state = playbackControlsSlice.reducer(initialState, setSeekTime(120));
    expect(state.seekTime).toBe(120);
    state = playbackControlsSlice.reducer(state, clearSeekTime());
    expect(state.seekTime).toBeNull();
  });

  it('should set and clear sleep timer', () => {
    let state = playbackControlsSlice.reducer(initialState, setSleepTimer(10));
    expect(state.sleepTimer.isActive).toBe(true);
    expect(state.sleepTimer.duration).toBe(10);
    expect(typeof state.sleepTimer.endTime).toBe('number');
    state = playbackControlsSlice.reducer(state, clearSleepTimer());
    expect(state.sleepTimer.isActive).toBe(false);
    expect(state.sleepTimer.duration).toBeNull();
    expect(state.sleepTimer.endTime).toBeNull();
  });
});
