import { create } from 'zustand';
import { createStore } from 'zustand/vanilla';

export type ItemsState = {
  pageRecordCount: number, //records per page
  currentPage: number, //current page
  categoryFilter: string | string[],
  tagFilter: string[],
  modalOpen: boolean,
  inEditMode: boolean,
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
}
export const createItemsStore = (
  initState: ItemsState = defaultPagesInitState,
) => {
  return createStore<ItemsStore>()((set) => ({
    ...initState,
    updateItemsPageRecordCount: (recordCount: number) => set((state) => ({ pageRecordCount: recordCount})),
    updateItemsCurrentPage: (currentPage: number) => set((state) => ({ currentPage })),
    updateItemsCategoryFilter: (category: string[] | string) => set(
      (state) => ({ categoryFilter: [...state.categoryFilter, ...category]})
    ),
    updateItemsTagFilter: (tags: string[]) => set((state) => ({ tagFilter: [...state.tagFilter, ...tags]})),
    updateModal: (modalOpen: boolean) => set((state) => ({ modalOpen })),
    updateEditMode: (inEditMode: boolean) => set((state) => ({ inEditMode })),
  }))
}
