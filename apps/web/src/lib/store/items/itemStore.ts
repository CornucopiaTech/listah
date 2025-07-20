import { create } from 'zustand';
import { createStore } from 'zustand/vanilla';

export type ItemsState = {
  pageRecordCount: number, //records per page
  currentPage: number, //current page
  categoryFilter: string | string[],
  tagFilter: string[],
}

export type ItemsActions = {
  updateItemsPageRecordCount: (recordCount: number) => void
  updateItemsCurrentPage: (currentPage: number) => void
  updateItemsCategoryFilter: (category: string | string[]) => void
  updateItemsTagFilter: (tags: string[]) => void
}

export type ItemsStore = ItemsState & ItemsActions
export const defaultPagesInitState: ItemsState = {
  pageRecordCount: 10,
  currentPage: 1,
  categoryFilter: "",
  tagFilter: [],
}
export const createItemsStore = (
  initState: ItemsState = defaultPagesInitState,
) => {
  return createStore<ItemsStore>()((set) => ({
    ...initState,
    updateItemsPageRecordCount: (recordCount) => set((state) => ({ pageRecordCount: recordCount})),
    updateItemsCurrentPage: (currentPage) => set((state) => ({ currentPage })),
    updateItemsCategoryFilter: (category) => set(
      (state) => ({ categoryFilter: [...state.categoryFilter, ...category]})
    ),
    updateItemsTagFilter: (tags) => set((state) => ({ tagFilter: [...state.tagFilter, ...tags]})),
  }))
}
