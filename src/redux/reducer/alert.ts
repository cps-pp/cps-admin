import { createDebouncedTimeout } from '@/lib/helper';
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AppThunk } from '../store';

export interface AlertState {
  show?: boolean;
  type: 'warning' | 'success' | 'error';
  title: string;
  message: string;
}

const initialState: AlertState = {
  show: false,
  type: 'success',
  title: '',
  message: '',
};

// `buildCreateSlice` allows us to create a slice with async thunks.
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const alert = createAppSlice({
  name: 'alert',
  initialState,
  reducers: (create) => ({
    showAlert: create.reducer((state, action: PayloadAction<AlertState>) => {
      const { payload } = action as any;
      state.show = true;
      state.title = payload.title;
      state.message = payload.message;
      state.type = payload.type;
    }),
    closeAlert: create.reducer((state) => {
      state.show = false;
      state.title = '';
      state.message = '';
    }),
  }),
  selectors: {
    selectShow: (alert) => alert.show,
    selectType: (alert) => alert.type,
    selectTitle: (alert) => alert.title,
    selectMessage: (alert) => alert.message,
  },
});

export const { showAlert, closeAlert } = alert.actions;
export const { selectShow, selectType, selectTitle, selectMessage } =
  alert.selectors;

const debouncedTimeout = createDebouncedTimeout();

// Thunk to show alert and automatically close after 5 seconds
export const showAlertWithAutoClose =
  (alertPayload: AlertState): AppThunk =>
  (dispatch) => {
    dispatch(showAlert(alertPayload));
    debouncedTimeout(() => {
      dispatch(closeAlert());
    }, 5);
  };
