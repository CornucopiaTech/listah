import type { PayloadAction } from '@reduxjs/toolkit';


import type { RootState } from '@/lib/state/store';
import type { ItemsState, ItemsStore, } from '@/lib/model/ItemsModel';


interface TagInterface { o: str; n: str}

export function setSummary(state: RootState, action: PayloadAction<string>) {
  state.item.summary = action.payload;
}

export function setCategory(state: RootState, action: PayloadAction<string>) {
  state.item.category = action.payload;
}

export function setDescription(state: RootState, action: PayloadAction<string>) {
  state.item.description = action.payload;
}

export function setNote(state: RootState, action: PayloadAction<string>) {
  state.item.note = action.payload;
}

export function setSoftDelete(state: RootState, action: PayloadAction<boolean>) {
  state.item.softDelete = action.payload;
}

export function setNewTag(state: RootState, action: PayloadAction<string>) {
  state.item.newTag = action.payload;
}

export function addNewTag(state: RootState) {
  if (state.newTag & state.newTag.trim() != "") {
    let tList: string[];
    if (!state.tag || state.tag.length == 0) {
      tList = [state.newTag]
    } else {
      tList = [state.newTag, ...state.tag];
    }
    state.item.tag = tList;
  }
}

export function setTag(state: RootState, action: PayloadAction<TagInterface>) {
  let tList: string[];

  if (!state.item.tag || state.item.tag.length == 0) {
    // If no tags, just add the new one
    tList = [action.payload.n]
  } else {
    // Replace the old tag with the new one
    const idx = state.item.tag.indexOf(action.payload.o);
    if (idx == -1) {
      // If no old tag found, just add the new one
      tList = [action.payload.n, ...state.item.tag]
    } else {
      // Replace the tag at the found index
      tList = [...state.item.tag.toSpliced(idx, 1, action.payload.n)]
    }
  }
  state.item.tag = tList;
}

export function removeTag(state: RootState, action: PayloadAction<string>) {
  if (state.item.tag && state.item.tag.length != 0) {
    state.item.tag = state.item.tag.filter(tag => tag !== action.payload);
  }

}

// export function setSoftDelete(state: RootState, action: PayloadAction<boolean>) {
//   state.item.softDelete = action.payload;
// }
