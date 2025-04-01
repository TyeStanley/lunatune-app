import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playbackControlsReducer from './features/playbackControls/playbackControlsSlice';
import queueReducer from './features/queue/queueSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      playbackControls: playbackControlsReducer,
      queue: queueReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Define the AppThunk type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  Action<string>
>;
