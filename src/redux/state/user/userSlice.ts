import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  name: null,
  picture: null,
  createdAt: null,
  updatedAt: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

export type { UserState };
