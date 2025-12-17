// External Imports
import { createSlice } from '@reduxjs/toolkit';

// Internal Imports
import type { RootState } from '@/lib/state/store';
import type { IDetailState } from '@/lib/model/ItemsModel';

import * as detailReducers from '@/lib/state/detailReducer';


// Define the initial state using that type
export const initialState: IDetailState = {
  item: {
    id: null,
    userId: null,
    summary: null,
    category: null,
    description: null,
    note: null,
    tag: null,
    softDelete: null,
    properties: null,
    reactivateAt: null,
    audit: null
  },
  newTag: null
}


export const detailSlice = createSlice({
  name: 'detail',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // setItem: detailReducers.setItem,
    setSummary: detailReducers.setSummary,
    setCategory: detailReducers.setCategory,
    setDescription: detailReducers.setDescription,
    setTag: detailReducers.setTag,
    setNote: detailReducers.setNote,
    setSoftDelete: detailReducers.setSoftDelete,
    // setProperties: detailReducers.setProperties,
    // setReactivateAt: detailReducers.setReactivateAt,
    setNewTag: detailReducers.setNewTag,
    reset: (state) => { state = initialState},
  },
})

export const {
  // setItem,
  setSummary,
  setCategory,
  setDescription,
  setTag,
  setNote,
  setSoftDelete,
  // setProperties,
  // setReactivateAt,
  setNewTag,
  reset
} = detailSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectListing = (state: RootState) => state.detail

export default detailSlice.reducer
