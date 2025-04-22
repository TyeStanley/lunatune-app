import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playbackControlsReducer from './state/playback-controls/playbackControlsSlice';
import queueReducer from './state/queue/queueSlice';
import { songApi } from './api/songApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      playbackControls: playbackControlsReducer,
      queue: queueReducer,
      [songApi.reducerPath]: songApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(songApi.middleware),
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
