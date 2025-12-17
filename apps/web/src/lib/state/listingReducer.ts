import type { PayloadAction } from '@reduxjs/toolkit';


import type { RootState } from '@/lib/state/store';
import type { ItemsState, ItemsStore, } from '@/lib/model/ItemsModel';



export function setItemsPerPage(state: RootState, action: PayloadAction<number>) {
  state.itemsPerPage = action.payload;
}

export function setCurrentPage(state: RootState, action: PayloadAction<number>) {
  state.currentPage = action.payload;
}

export function setCategoryFilter(state: RootState, action: PayloadAction<number>) {
  state.currentPage = action.payload;
}

export function setTagFilter(state: RootState, action: PayloadAction<number>) {
  state.tagFilter = action.payload;
}

export function setToggleDrawer(state: RootState, action: PayloadAction<boolean>) {
  state.toggleDrawer = action.payload;
}

export function setSearchQuery(state: RootState, action: PayloadAction<number>) {
  state.searchQuery = action.payload;
}

export function setCheckedCategory(state: RootState, action: PayloadAction<string>) {
  // Create a new set with the existing elements and a new element. This new set will have the new element and the existing set will not have the new element in the case of an insertion. In the case of deletion, the new set will have the new element but the previous set will not have the new element and so the new element will be removed from the set in the block of code below.
  let newChecked: Set<string> = state.checkedCategory.union(new Set([action.payload]));

  if (state.checkedCategory.has(action.payload)) {
    // Remove element from state if it already exists, meaning that it was checked and it needs to  be unchecked
    newChecked.delete(action.payload)
  }
  state.checkedCategory = newChecked;
}

export function setCheckedTag(state: RootState, action: PayloadAction<string>) {
  // state.checkedTag = action.payload;
  // Create a new set with the existing elements and a new element. This new set will have the new element and the existing set will not have the new element in the case of an insertion. In the case of deletion, the new set will have the new element but the previous set will not have the new element and so the new element will be removed from the set in the block of code below.
  let newChecked: Set<string> = state.checkedTag.union(new Set([action.payload]));

  if (state.checkedTag.has(action.payload)) {
    // Remove element from state if it already exists, meaning that it was checked and it needs to  be unchecked
    newChecked.delete(action.payload)
  }
  state.checkedTag = newChecked;
}

export function setFromFilterDate(state: RootState, action: PayloadAction<number>) {
  state.fromFilterDate = action.payload;
}

export function setToFilterDate(state: RootState, action: PayloadAction<number>) {
  state.toFilterDate = action.payload;

}

export function applyFilter(state: RootState) {
  state.categoryFilter = [...state.checkedCategory];
  state.tagFilter = [...state.checkedTag];
  state.toggleDrawer = false;
}

export function resetFilter(state: RootState) {
  state.categoryFilter = [];
  state.tagFilter = [];
  state.checkedCategory = new Set([]);
  state.checkedTag = new Set([]);
  state.searchQuery = "";
  state.fromFilterDate = "";
  state.toFilterDate = "";
  state.toggleDrawer = false;
}

// export function setToggleDrawer(state: RootState, action: PayloadAction<number>) {
//   state.toggleDrawer = action.payload;
// }


// // Define the initial state using that type
// export const initialState: ItemsState = {
//   itemsPerPage: 50,
//   currentPage: 1,
//   categoryFilter: [],
//   tagFilter: [],
//   drawerOpen: false,
//   searchQuery: '',
//   checkedTag: new Set([]),
//   checkedCategory: new Set([]),
//   fromFilterDate: '',
//   toFilterDate: '',
// }


// export const listingSlice = createSlice({
//   name: 'listing ',
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState,
//   reducers: {
//     setItemsPageRecordCount: (state) => {
//       state.value += 1
//     },
//     decrement: (state) => {
//       state.value -= 1
//     },
//     // Use the PayloadAction type to declare the contents of `action.payload`
//     incrementByAmount: (state, action: PayloadAction<number>) => {
//       state.value += action.payload
//     },
//   },
// })

// export const { increment, decrement, incrementByAmount } = counterSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

// export default counterSlice.reducer
