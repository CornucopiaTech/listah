import { createSlice } from '@reduxjs/toolkit'

export const itemListingSlice = createSlice({
    name: 'itemview',
    initialState: {
        value: {
            selectedItem: null,
            status: 'viewing',


        }
    },
    reducers: {
		"itemListingClickItem": (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
			if (state.value.selectedItem && state.value.selectedItem.id == action.payload.id) {
				state.value = { ...state.value, selectedItem: null }
			} else {
				state.value = { ...state.value, selectedItem: action.payload }

			}
        }
    }
})

// Action creators are generated for each case reducer function
export const { itemListingClickItem } = itemListingSlice.actions

export default itemListingSlice.reducer
