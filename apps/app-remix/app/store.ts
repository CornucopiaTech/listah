// import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import itemReducer from './hooks/state/itemSlice';


export const store = configureStore({
    reducer: {
		item: itemReducer,
    }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
// Export a reusable type for handwritten thunks
// export type AppThunk = ThunkAction<void, RootState, unknown, Action>
