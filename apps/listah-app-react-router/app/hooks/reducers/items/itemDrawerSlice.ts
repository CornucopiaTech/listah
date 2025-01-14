
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '~/store';


const initialState: boolean = false;

export const itemDrawerSlice = createSlice({
    name: 'itemDrawer',
    initialState: {
		value: initialState
    },
    reducers: {
        openDrawer: state => {
            state.value = true
        },
        closeDrawer: state => {
            state.value = false
        },
		toggleDrawer: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { openDrawer, closeDrawer, toggleDrawer } = itemDrawerSlice.actions;

export default itemDrawerSlice.reducer;
export const selectItemDrawer = (state: RootState) => state.itemDrawer.value;
