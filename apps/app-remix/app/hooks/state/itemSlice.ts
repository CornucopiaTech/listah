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

} from './itemReducer';


const initialState: ItemStateReduxInterface = {
    value: {
        selectedItem: null,
        editStatus: 'viewing',
        filterDrawerStatus: false,
        tagCollapsed: true,
        newTag: "",
        definedFilters: []
    }
};

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
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
} = itemSlice.actions;

export default itemSlice.reducer;
export const selectItem = (state: RootState) => state.item.value;
