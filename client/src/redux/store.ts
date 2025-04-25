import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playbackControlsReducer from './state/playback-controls/playbackControlsSlice';
import queueReducer from './state/queue/queueSlice';
import authReducer from './state/auth/authSlice';
import userReducer from './state/user/userSlice';
import { songApi } from './api/songApi';
import { userApi } from './api/userApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      playbackControls: playbackControlsReducer,
      queue: queueReducer,
      auth: authReducer,
      user: userReducer,
      [songApi.reducerPath]: songApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(songApi.middleware, userApi.middleware),
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
