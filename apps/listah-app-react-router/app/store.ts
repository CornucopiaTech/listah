import { configureStore } from '@reduxjs/toolkit';

import itemDrawerReducer from './hooks/reducers/items/itemDrawerSlice';
import itemFilterReducer  from './hooks/reducers/items/itemFilterSlice';
import itemViewReducer from './hooks/reducers/items/itemViewSlice';

// export default configureStore({
export const store = configureStore({
    reducer: {
        itemDrawer: itemDrawerReducer,
        itemFilter: itemFilterReducer,
		itemView: itemViewReducer,
    }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
