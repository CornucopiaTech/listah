import { createSlice } from '@reduxjs/toolkit'

export const itemViewSlice = createSlice({
    name: 'itemview',
    initialState: {
        value: {
            status: 'viewing',
			title: "",
			description: "",
			note: "",
			tags: [],
			properties: null,
        }
    },
    reducers: {
		"itemViewChangeState": (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = { ...state.value, status: action.payload }
        },
        "itemViewEdit": state => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value = { ...state.value }
        },
        "itemViewDelete": state => {
            state.value = { ...state.value }
        },
        "itemViewSave": (state, action) => {
            state.value = { ...state.value }
        }
    }
})

// Action creators are generated for each case reducer function
export const { itemViewEdit, itemViewDelete, itemViewSave } = itemViewSlice.actions

export default itemViewSlice.reducer
