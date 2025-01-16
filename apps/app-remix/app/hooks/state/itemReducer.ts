
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ItemModelInterface,
  TagChangePayloadInterface,
} from '~/model/item';
import type { AppDispatch, RootState } from '~/store';

export function ChooseSelectedItemReducer(state, action: PayloadAction<ItemModelInterface>) {
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  let newSelected: ItemModelInterface | null = action.payload;
  if (state.value.selectedItem && state.value.selectedItem.id == action.payload.id) {
    newSelected = null
  }
  state.value.selectedItem = newSelected;
  state.value.newTag = "";
  state.value.editStatus = 'viewing';
}

export function ChangeSelectedItemTagsReducer(state, action: PayloadAction<TagChangePayloadInterface>){
  if (state.value.selectedItem){
    let newSelected: ItemModelInterface = state.value.selectedItem;
    if (action.payload.current === null && action.payload.previous !== null) {
      let tagsLeft: string[] = newSelected.tags.filter((item: string) => item != action.payload.previous);
      newSelected.tags = tagsLeft;
    } else if (action.payload.current !== null && action.payload.previous === null) {
      newSelected.tags.push(action.payload.current);
    } else if (action.payload.current !== null && action.payload.previous !== null) {
      newSelected.tags = newSelected.tags.filter((item: string) => item != action.payload.previous);
      newSelected.tags.push(action.payload.current);
    }
    state.value.selectedItem = newSelected;
  }
}

export function ToggleCollapseTagsReducer(state) {
  state.value.tagCollapsed = !state.value.tagCollapsed;
}

export function DeleteSelectedItemReducer(state, action: PayloadAction<string>) {
  if (state.value.selectedItem){
    let newSelected: ItemModelInterface = state.value.selectedItem;
    if (state.value.selectedItem) {
      newSelected.tags = newSelected.tags.filter((item: string) => item !== action.payload);
    }
    state.value.selectedItem = newSelected;
  }
}

export function ChangeEditStatusReducer(state, action: PayloadAction<string>){
  state.value.editStatus = action.payload;
}

export function ChangeSelectedItemTitleReducer(state, action: PayloadAction<string>){
  state.value.selectedItem.title = action.payload;
}

export function SaveUpdatedItemReducer (state) {
  if (state.value.selectedItem) {
    let newSelected: ItemModelInterface = state.value.selectedItem;
    if (state.value.newTag !== "") {
      newSelected.tags.push(state.value.newTag);
    }
    state.value.selectedItem = newSelected;
    state.value.newTag = "";
    state.value.editStatus = 'viewing';
  }
}

export function AddNewTagToSelectedItemReducer(state) {
  if (state.value.selectedItem) {
    if (state.value.newTag !== "") {
      let newSelected: ItemModelInterface = state.value.selectedItem;
      newSelected.tags.push(state.value.newTag);
      state.value.selectedItem = newSelected;
    }
  }
}

export function SetStateAfterItemSaveReducer(state) {
  state.value.newTag = "";
  state.value.editStatus = 'viewing';
}

export function CreateSelectedItemNewTagReducer(state, action: PayloadAction<string>) {
  state.value.newTag = action.payload;
}

export function ChangeSelectedItemSummaryReducer(state, action: PayloadAction<string>) {
  if (state.value.selectedItem){
    state.value.selectedItem.summary = action.payload;
  }
}

export function ChangeSelectedItemNoteReducer(state, action: PayloadAction<string>) {
  if (state.value.selectedItem){
    state.value.selectedItem.note = action.payload;
  }
}

export function ChangeSelectedItemDescriptionReducer(state, action: PayloadAction<string>) {
  if (state.value.selectedItem){
    state.value.selectedItem.description = action.payload;
  }
}

export function OpenFilterReducer(state) {
  state.value.filterDrawerStatus = true;
}

export function CloseFilterReducer(state) {
  state.value.filterDrawerStatus = false;
}

export function ToggleFilterDrawerReducer(state) {
  state.value.filterDrawerStatus = action.payload;
}

export function AddFilterReducer(state, action: PayloadAction<string>){
  state.value.definedFilters = [...state.value.definedFilters, action.payload]
}

export function ResetFilterReducer(state){
  state.value.definedFilters = []
}
