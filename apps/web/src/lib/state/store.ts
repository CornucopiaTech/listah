import { configureStore } from '@reduxjs/toolkit';
import listingSlice from '@/lib/state/listingSlice';
import detailSlice from '@/lib/state/detailSlice';
// ...

export const store = configureStore({
  reducer: {
    listing: listingSlice,
    detail: detailSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
