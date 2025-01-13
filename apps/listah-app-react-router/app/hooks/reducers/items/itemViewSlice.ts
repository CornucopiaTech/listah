import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ItemModel } from '~/model/item';
import type { AppDispatch, AppStore, RootState } from '~/store';


export interface ItemViewInterface {
	selectedItem: null | ItemModel
	status: string
	tagCollapsed: boolean,
	newTag: string
}

const initialState: ItemViewInterface = {
	selectedItem: null,
	status: 'viewing',
	tagCollapsed: true,
	newTag: ""
}

export interface TagChangePayloadInterface {
	previous: null | string
	current: null | string
}

export const itemViewSlice = createSlice({
    name: 'itemView',
    initialState: {
		value: initialState
    },
    reducers: {
		"ClickItem": (state, action: PayloadAction<ItemModel>) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			let newSelected: ItemModel | null = action.payload;
			if (state.value.selectedItem && state.value.selectedItem.id == action.payload.id) {
				newSelected = null
			}

			state.value = {
				...state.value,
				selectedItem: newSelected,
				newTag: "",
				status: 'viewing',
			}
		},
		"ToggleCollapseTags": (state) => {
			state.value = { ...state.value, tagCollapsed: !state.value.tagCollapsed }
		},
		"ChangeTags": (state, action: PayloadAction<TagChangePayloadInterface>) => {
			if (state.value.selectedItem){
				let newSelected: ItemModel = state.value.selectedItem;
				if (action.payload.current === null && action.payload.previous !== null) {
					newSelected.tags = newSelected.tags.filter((item: string) => item !== action.payload.previous);
				} else if (action.payload.current !== null && action.payload.previous === null) {
					newSelected.tags.push(action.payload.current);
				} else if (action.payload.current !== null && action.payload.previous !== null) {
					newSelected.tags = newSelected.tags.filter((item: string) => item !== action.payload.previous);
					newSelected.tags.push(action.payload.current);
				}
				state.value = { ...state.value, selectedItem: newSelected }
			}

		},
		"ChangeStatus": (state, action: PayloadAction<string>) => {

			state.value = { ...state.value, status: action.payload }

		},
		"SaveUpdatedItem": (state) => {
			if (state.value.selectedItem) {
				let newSelected: ItemModel = state.value.selectedItem;
				if (state.value.newTag !== "") {
					newSelected.tags.push(state.value.newTag);
				}
				state.value = { ...state.value, selectedItem: newSelected, newTag: "" }
			}
		},
		"CreateNewTag": (state, action: PayloadAction<string>) => {
			state.value = {
				...state.value,
				newTag: action.payload
			}
		},
    }
})

// Action creators are generated for each case reducer function
export const {
	ClickItem,
	ToggleCollapseTags,
	ChangeTags,
	ChangeStatus,
	CreateNewTag,
	SaveUpdatedItem
} = itemViewSlice.actions

export default itemViewSlice.reducer
export const selectItemView = (state: RootState) => state.itemView.value;
