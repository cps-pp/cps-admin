// src/redux/store.ts
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import alertSlice from './reducer/alert'

const rootReducer = combineSlices(alertSlice)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (gDM) => gDM(),
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch

export default store


// import type { Action, ThunkAction } from '@reduxjs/toolkit';
// import { combineSlices, configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { alert } from '@/redux/reducer/alert';
// import { user } from '@/redux/reducer/user';

// // `combineSlices` automatically combines the reducers using
// // their `reducerPath`s, therefore we no longer need to call `combineReducers`.
// const rootReducer = combineSlices(alert, user);
// // Infer the `RootState` type from the root reducer
// export type RootState = ReturnType<typeof rootReducer>;

// // The store setup is wrapped in `makeStore` to allow reuse
// // when setting up tests that need the same store config
// export const makeStore = (preloadedState?: Partial<RootState>) => {
//   const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
//     preloadedState,
//   });
//   // configure listeners using the provided defaults
//   // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
//   setupListeners(store.dispatch);
//   return store;
// };
// const store = makeStore();

// // Infer the type of `store`
// export type AppStore = typeof store;
// // Infer the `AppDispatch` type from the store itself
// export type AppDispatch = typeof store.dispatch;
// export type AppThunk<ThunkReturnType = void> = ThunkAction<
//   ThunkReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

// export default store;
