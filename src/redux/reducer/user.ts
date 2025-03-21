import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IUser } from '@/types/user';

export interface AlertState {
  me: IUser | {};
}

const initialState: AlertState = {
  me: {},
};

// `buildCreateSlice` allows us to create a slice with async thunks.
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const user = createAppSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    setUser: create.reducer((state, action: PayloadAction<AlertState>) => {
      const { payload } = action as any;
      state.me = payload;
    }),
  }),
  selectors: {
    selectMe: (state) => state.me,
  },
});

export const { setUser } = user.actions;
export const { selectMe } = user.selectors;
