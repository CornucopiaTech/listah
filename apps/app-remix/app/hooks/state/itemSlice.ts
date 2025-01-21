import { createSlice} from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';



import type { RootState } from 'app/store';
import type { ItemStateReduxInterface } from '~/model/items';
import {
  AddFilterReducer,
  ChangeEditStatusReducer,
  ChangeSelectedItemDescriptionReducer,
  ChangeSelectedItemNoteReducer,
  ChangeSelectedItemSummaryReducer,
  ChangeSelectedItemTagsReducer,
  ChangeSelectedItemTitleReducer,
  ChooseSelectedItemReducer,
  CloseFilterReducer,
  CreateSelectedItemNewTagReducer,
  DeleteSelectedItemReducer,
  OpenFilterReducer,
  ResetFilterReducer,
  SaveUpdatedItemReducer,
  ToggleCollapseTagsReducer,
  ToggleFilterDrawerReducer,
  AddNewTagToSelectedItemReducer,
  SetStateAfterItemSaveReducer,
  AddTagFilterReducer,
  AddCategoryFilterReducer,
} from './itemReducer';


const initialState: ItemStateReduxInterface = {
  value: {
    selectedItem: null,
    editStatus: 'viewing',
    filterDrawerStatus: false,
    tagCollapsed: true,
    newTag: "",
    definedFilters: [],
    categoryFilters: [],
    tagFilters: [],
  }
};

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
      ResetState: (state) => ( state.value = initialState ),
      AddFilter: AddFilterReducer,
      ChangeEditStatus: ChangeEditStatusReducer,
      ChangeSelectedItemDescription: ChangeSelectedItemDescriptionReducer,
      ChangeSelectedItemNote: ChangeSelectedItemNoteReducer,
      ChangeSelectedItemSummary: ChangeSelectedItemSummaryReducer,
      ChangeSelectedItemTags: ChangeSelectedItemTagsReducer,
      ChangeSelectedItemTitle: ChangeSelectedItemTitleReducer,
      ChooseSelectedItem: ChooseSelectedItemReducer,
      CloseFilterDrawer: CloseFilterReducer,
      CreateSelectedItemNewTag: CreateSelectedItemNewTagReducer,
      DeleteSelectedItemTag: DeleteSelectedItemReducer,
      OpenFilterDrawer: OpenFilterReducer,
      ResetFilter: ResetFilterReducer,
      SaveUpdatedItem: SaveUpdatedItemReducer,
      ToggleCollapseTags: ToggleCollapseTagsReducer,
      ToggleFilterDrawer: ToggleFilterDrawerReducer,
      AddNewTagToSelectedItem: AddNewTagToSelectedItemReducer,
      SetStateAfterItemSave: SetStateAfterItemSaveReducer,
      AddCategoryFilter: AddCategoryFilterReducer,
      AddTagFilter: AddTagFilterReducer,
    }
});

// Action creators are generated for each case reducer function
export const {
  AddFilter, //Add logic to take care of removing or adding filters.
  ChangeEditStatus,
  ChangeSelectedItemDescription,
  ChangeSelectedItemNote,
  ChangeSelectedItemSummary,
  ChangeSelectedItemTags,
  ChangeSelectedItemTitle,
  ChooseSelectedItem,
  CloseFilterDrawer,
  CreateSelectedItemNewTag,
  DeleteSelectedItemTag,
  OpenFilterDrawer,
  ResetFilter,
  SaveUpdatedItem,
  ToggleCollapseTags,
  ToggleFilterDrawer,
  AddNewTagToSelectedItem,
  SetStateAfterItemSave,
  ResetState,
  AddCategoryFilter,
  AddTagFilter,
} = itemSlice.actions;

export default itemSlice.reducer;
export const selectItem = (state: RootState) => state.item.value;
