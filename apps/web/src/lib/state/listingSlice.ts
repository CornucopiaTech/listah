// External Imports
import { createSlice } from '@reduxjs/toolkit';

// Internal Imports
import type { RootState } from '@/lib/state/store';
import * as listingReducers from '@/lib/state/listingReducer';


// Define the initial state using that type
export const initialState: ItemsState = {
  itemsPerPage: 50,
  currentPage: 1,
  categoryFilter: [],
  tagFilter: [],
  drawerOpen: false,
  searchQuery: '',
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  fromFilterDate: '',
  toFilterDate: '',
}

export const listingSlice = createSlice({
  name: 'listing',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setItemsPerPage: listingReducers.setItemsPerPage,
    setCurrentPage: listingReducers.setCurrentPage,
    setCategoryFilter: listingReducers.setCategoryFilter,
    setTagFilter: listingReducers.setTagFilter,
    setToggleDrawer: listingReducers.setToggleDrawer,
    setSearchQuery: listingReducers.setSearchQuery,
    setCheckedCategory: listingReducers.setCheckedCategory,
    setCheckedTag: listingReducers.setCheckedTag,
    setFromFilterDate: listingReducers.setFromFilterDate,
    setToFilterDate: listingReducers.setToFilterDate,
    // setSearchQuery: listingReducers.setSearchQuery,

  },
})

export const {
  setItemsPerPage,
  setCurrentPage,
  setCategoryFilter,
  setTagFilter,
  setToggleDrawer,
  setSearchQuery,
  setCheckedCategory,
  setCheckedTag,
  setFromFilterDate,
  setToFilterDate,
} = listingSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectListing = (state: RootState) => state.listing

export default listingSlice.reducer
