import { create } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';

export type ItemsState = {
  pageRecordCount: number, //records per page
  currentPage: number, //current page
  categoryFilter: string | string[],
  tagFilter: string[],
  modalOpen: boolean,
  inEditMode: boolean,
  editedItem: IProtoItem | null,
}

export type ItemsActions = {
  updateItemsPageRecordCount: (recordCount: number) => void
  updateItemsCurrentPage: (currentPage: number) => void
  updateItemsCategoryFilter: (category: string | string[]) => void
  updateItemsTagFilter: (tags: string[]) => void
  updateModal: (modalOpen: boolean) => void
  updateEditMode: (inEditMode: boolean) => void
}

export type ItemsStore = ItemsState & ItemsActions
export const defaultPagesInitState: ItemsState = {
  pageRecordCount: 20,
  currentPage: 1,
  categoryFilter: "",
  tagFilter: [],
  modalOpen: false,
  inEditMode: false,
  editedItem: null
}
export const createItemsStore = (
  initState: ItemsState = defaultPagesInitState,
) => {
  return createStore<ItemsStore>()((set) => ({
    ...initState,
    updateItemsPageRecordCount: (recordCount: number) => set(() => ({ pageRecordCount: recordCount})),
    updateItemsCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
    updateItemsCategoryFilter: (category: string[] | string) => set(
      (state) => ({ categoryFilter: [...state.categoryFilter, ...category]})
    ),
    updateItemsTagFilter: (tags: string[]) => set((state) => ({ tagFilter: [...state.tagFilter, ...tags]})),
    updateModal: (modalOpen: boolean) => set(() => ({ modalOpen })),
    updateEditMode: (inEditMode: boolean) => set(() => ({ inEditMode })),
    updateEditedItem: (inEditMode: boolean) => set(() => ({ inEditMode })),
  }))
}
