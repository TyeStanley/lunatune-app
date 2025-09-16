import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SleepTimerManager from '@/components/sleep-timer/SleepTimerManager';
import playbackControlsSlice from '@/redux/state/playback-controls/playbackControlsSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      playbackControls: playbackControlsSlice,
    },
    preloadedState: {
      playbackControls: {
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
        ...initialState,
      },
    },
  });
};

describe('SleepTimerManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing (returns null)', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not set up timer when sleep timer is not active', () => {
    const store = createMockStore({
      sleepTimer: {
        isActive: false,
        endTime: null,
        duration: null,
      },
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    expect(setIntervalSpy).not.toHaveBeenCalled();
    setIntervalSpy.mockRestore();
  });

  it('does not set up timer when sleep timer is active but no end time', () => {
    const store = createMockStore({
      sleepTimer: {
        isActive: true,
        endTime: null,
        duration: 30,
      },
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    expect(setIntervalSpy).not.toHaveBeenCalled();
    setIntervalSpy.mockRestore();
  });

  it('sets up timer when sleep timer is active with end time', () => {
    const endTime = Date.now() + 60000; // 1 minute from now
    const store = createMockStore({
      sleepTimer: {
        isActive: true,
        endTime,
        duration: 30,
      },
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    setIntervalSpy.mockRestore();
  });

  it('dispatches pause and clearSleepTimer when timer expires', async () => {
    const endTime = Date.now() + 1000; // 1 second from now
    const store = createMockStore({
      sleepTimer: {
        isActive: true,
        endTime,
        duration: 30,
      },
    });

    render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    // Fast-forward time to trigger timer expiration
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    const state = store.getState();
    expect(state.playbackControls.isPlaying).toBe(false);
    expect(state.playbackControls.sleepTimer.isActive).toBe(false);
    expect(state.playbackControls.sleepTimer.endTime).toBeNull();
    expect(state.playbackControls.sleepTimer.duration).toBeNull();
  });

  it('cleans up interval on unmount', () => {
    const endTime = Date.now() + 60000;
    const store = createMockStore({
      sleepTimer: {
        isActive: true,
        endTime,
        duration: 30,
      },
    });

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('updates timer when sleep timer state changes', () => {
    const store = createMockStore({
      sleepTimer: {
        isActive: false,
        endTime: null,
        duration: null,
      },
    });

    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    const { rerender } = render(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    expect(setIntervalSpy).not.toHaveBeenCalled();

    // Update store with active timer
    act(() => {
      store.dispatch({
        type: 'playbackControls/setSleepTimer',
        payload: 30,
      });
    });

    rerender(
      <Provider store={store}>
        <SleepTimerManager />
      </Provider>,
    );

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    setIntervalSpy.mockRestore();
  });
});
