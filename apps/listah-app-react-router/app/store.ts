import { configureStore } from '@reduxjs/toolkit'
import itemDrawerReducer from './hooks/reducers/items/itemDrawerSlice'
import itemFilterReducer  from './hooks/reducers/items/itemFilterSlice'

export default configureStore({
    reducer: {
        itemDrawer: itemDrawerReducer,
        itemFilter: itemFilterReducer,
    }
})
