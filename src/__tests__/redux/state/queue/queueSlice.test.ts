import {
  queueSlice,
  setCurrentSong,
  addToUpcoming,
  removeFromUpcoming,
  addToPlayed,
  removeFromPlayed,
  clearQueue,
  setQueueFromPlaylist,
} from '@/redux/state/queue/queueSlice';

const mockSong = (id = '1'): import('@/types/song').Song => ({
  id,
  title: `Song ${id}`,
  artist: 'Artist',
  album: 'Album',
  filePath: `/music/${id}.mp3`,
  durationMs: 200000,
  albumArtUrl: '',
  createdAt: '',
  updatedAt: '',
  isLiked: false,
  likeCount: 0,
});

describe('queueSlice', () => {
  const initialState = {
    currentSong: null,
    upcomingSongs: [],
    playedSongs: [],
  };

  it('should return the initial state', () => {
    expect(queueSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set current song', () => {
    const song = mockSong('1');
    const state = queueSlice.reducer(initialState, setCurrentSong(song));
    expect(state.currentSong).toEqual(song);
  });

  it('should add to upcoming and remove from upcoming', () => {
    const song = mockSong('2');
    let state = queueSlice.reducer(initialState, addToUpcoming(song));
    expect(state.upcomingSongs).toContainEqual(song);
    state = queueSlice.reducer(state, removeFromUpcoming(0));
    expect(state.upcomingSongs).toHaveLength(0);
  });

  it('should add to played and remove from played', () => {
    const song = mockSong('3');
    let state = queueSlice.reducer(initialState, addToPlayed(song));
    expect(state.playedSongs).toContainEqual(song);
    state = queueSlice.reducer(state, removeFromPlayed(0));
    expect(state.playedSongs).toHaveLength(0);
  });

  it('should clear the queue', () => {
    const stateWithSongs = {
      currentSong: mockSong('1'),
      upcomingSongs: [mockSong('2')],
      playedSongs: [mockSong('3')],
    };
    const state = queueSlice.reducer(stateWithSongs, clearQueue());
    expect(state).toEqual(initialState);
  });

  it('should set queue from playlist', () => {
    const payload = {
      currentSong: mockSong('1'),
      previousSongs: [mockSong('2')],
      upcomingSongs: [mockSong('3')],
    };
    const state = queueSlice.reducer(initialState, setQueueFromPlaylist(payload));
    expect(state.currentSong).toEqual(payload.currentSong);
    expect(state.playedSongs).toEqual(payload.previousSongs);
    expect(state.upcomingSongs).toEqual(payload.upcomingSongs);
  });
});
