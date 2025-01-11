import { createSlice } from '@reduxjs/toolkit'

export const itemFilterSlice = createSlice({
    name: 'itemFilter',
    initialState: {
        value: []
    },
    reducers: {
        filterChecked: (state , action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = [...state.value, action.payload]
        },
        filterApply: state => {
            state.value = []
        },
        filterReset: (state) => {
            state.value = []
        }
    }
})

// Action creators are generated for each case reducer function
export const { filterChecked, filterApply, filterReset } = itemFilterSlice.actions

export default itemFilterSlice.reducer
