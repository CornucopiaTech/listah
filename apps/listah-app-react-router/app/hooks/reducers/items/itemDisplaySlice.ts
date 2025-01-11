import { createSlice } from '@reduxjs/toolkit'

export const itemDisplaySlice = createSlice({
    name: 'itemDisplay',
    initialState: {
        value: {
            selected: null,
            status: 'viewing',


        }
    },
    reducers: {
        "itemView/edit": state => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = { ...state.value }
        },
        "itemView/delete": state => {
            state.value = { ...state.value }
        },
        "itemView/save": (state, action) => {
            state.value = { ...state.value }
        }
    }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = itemDisplaySlice.actions

export default itemDisplaySlice.reducer
