// import { createDebouncedTimeout } from '@/lib/helper';
// import {
//   asyncThunkCreator,
//   buildCreateSlice,
//   PayloadAction,
// } from '@reduxjs/toolkit';
// import { AppThunk } from '../store';

// export interface AlertState {
//   show?: boolean;
//   type: 'warning' | 'success' | 'error';
//   title: string;
//   message: string;
// }

// const initialState: AlertState = {
//   show: false,
//   type: 'success',
//   title: '',
//   message: '',
// };

// // `buildCreateSlice` allows us to create a slice with async thunks.
// export const createAppSlice = buildCreateSlice({
//   creators: { asyncThunk: asyncThunkCreator },
// });

// export const alert = createAppSlice({
//   name: 'alert',
//   initialState,
//   reducers: (create) => ({
//     showAlert: create.reducer((state, action: PayloadAction<AlertState>) => {
//       const { payload } = action as any;
//       state.show = true;
//       state.title = payload.title;
//       state.message = payload.message;
//       state.type = payload.type;
//     }),
//     closeAlert: create.reducer((state) => {
//       state.show = false;
//       state.title = '';
//       state.message = '';
//     }),
//   }),
//   selectors: {
//     selectShow: (alert) => alert.show,
//     selectType: (alert) => alert.type,
//     selectTitle: (alert) => alert.title,
//     selectMessage: (alert) => alert.message,
//   },
// });

// export const { showAlert, closeAlert } = alert.actions;
// export const { selectShow, selectType, selectTitle, selectMessage } =
//   alert.selectors;

// const debouncedTimeout = createDebouncedTimeout();

// // Thunk to show alert and automatically close after 5 seconds
// export const showAlertWithAutoClose =
//   (alertPayload: AlertState): AppThunk =>
//   (dispatch) => {
//     dispatch(showAlert(alertPayload));
//     debouncedTimeout(() => {
//       dispatch(closeAlert());
//     }, 5);
//   };
// src/redux/reducer/alert.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'  

export type AlertType = 'warning' | 'success' | 'error'

export interface AlertState {
  show: boolean
  title: string
  message: string
  type: AlertType
}

const initialState: AlertState = {
  show: false,
  title: '',
  message: '',
  type: 'success',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    openAlert(
      state,
      action: PayloadAction<{
        type: AlertType
        title: string
        message: string
      }>,
    ) {
      state.show = true
      state.type = action.payload.type
      state.title = action.payload.title
      state.message = action.payload.message
    },
    closeAlert(state) {
      state.show = false
    },
  },
})

// Export actions + selectors
export const { openAlert, closeAlert } = alertSlice.actions
export const selectShow = (s: RootState) => s.alert.show
export const selectType = (s: RootState) => s.alert.type
export const selectTitle = (s: RootState) => s.alert.title
export const selectMessage = (s: RootState) => s.alert.message

export default alertSlice
