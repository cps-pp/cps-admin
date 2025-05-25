// // import {
// //   asyncThunkCreator,
// //   buildCreateSlice,
// //   PayloadAction,
// // } from '@reduxjs/toolkit';
// // import { IUser } from '@/types/user';

// // export interface AlertState {
// //   me: IUser | {};
// // }

// // const initialState: AlertState = {
// //   me: {},
// // };

// // // `buildCreateSlice` allows us to create a slice with async thunks.
// // export const createAppSlice = buildCreateSlice({
// //   creators: { asyncThunk: asyncThunkCreator },
// // });

// // export const user = createAppSlice({
// //   name: 'user',
// //   initialState,
// //   reducers: (create) => ({
// //     setUser: create.reducer((state, action: PayloadAction<AlertState>) => {
// //       const { payload } = action as any;
// //       state.me = payload;
// //     }),
// //   }),
// //   selectors: {
// //     selectMe: (state) => state.me,
// //   },
// // });

// // export const { setUser } = user.actions;
// // export const { selectMe } = user.selectors;
// // src/redux/reducer/user.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'

// export interface UserState {
//   id: string | null
//   name: string
// }

// const initialState: UserState = {
//   id: null,
//   name: '',
// }

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser(state, action: PayloadAction<{ id: string; name: string }>) {
//       state.id = action.payload.id
//       state.name = action.payload.name
//     },
//     clearUser(state) {
//       state.id = null
//       state.name = ''
//     },
//   },
// })

// export const { setUser, clearUser } = userSlice.actions
// export const selectUser = (s: RootState) => s.user

// export default userSlice
