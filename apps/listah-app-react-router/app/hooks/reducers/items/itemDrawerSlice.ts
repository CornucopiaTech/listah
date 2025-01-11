
import { createSlice } from '@reduxjs/toolkit'

export const itemDrawerSlice = createSlice({
    name: 'itemDrawer',
    initialState: {
        value: false
    },
    reducers: {
        openDrawer: state => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = true
        },
        closeDrawer: state => {
            state.value = false
        },
        toggleDrawer: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { openDrawer, closeDrawer, toggleDrawer } = itemDrawerSlice.actions

export default itemDrawerSlice.reducer
