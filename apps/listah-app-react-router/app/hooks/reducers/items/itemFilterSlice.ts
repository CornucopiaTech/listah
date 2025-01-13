import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '~/store';


const initialState: string[] = []


export const itemFilterSlice = createSlice({
    name: 'itemFilter',
    initialState: {
		value: initialState
    },
    reducers: {
        filterChecked: (state, action: PayloadAction<string>) => {
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
export const { filterChecked, filterApply, filterReset } = itemFilterSlice.actions;

export default itemFilterSlice.reducer;
export const selectItemFilter = (state: RootState) => state.itemFilter.value;

