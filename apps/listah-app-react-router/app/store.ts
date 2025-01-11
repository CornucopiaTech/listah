import { configureStore } from '@reduxjs/toolkit';
import itemDrawerReducer from './hooks/reducers/items/itemDrawerSlice';
import itemFilterReducer  from './hooks/reducers/items/itemFilterSlice';
import itemListingReducer from './hooks/reducers/items/itemListSlice';

export default configureStore({
    reducer: {
        itemDrawer: itemDrawerReducer,
        itemFilter: itemFilterReducer,
		itemListing: itemListingReducer,
    }
})
