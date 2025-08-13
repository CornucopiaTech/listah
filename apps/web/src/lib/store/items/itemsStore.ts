import { createStore } from 'zustand/vanilla';
import { ItemsState, ItemsStore, } from '@/lib/model/ItemsModel';



export const defaultPagesInitState: ItemsState = {
  itemsPerPage: 20,
  currentPage: 1,
  categoryFilter: [],
  tagFilter: [],
  modalOpen: false,
  inEditMode: false,
}
export const createItemsStore = (
  initState: ItemsState = defaultPagesInitState,
) => {
  return createStore<ItemsStore>()((set) => ({
    ...initState,
    updateItemsPageRecordCount: (recordCount: number) => set(() => ({ itemsPerPage: recordCount})),
    updateItemsCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
    updateItemsCategoryFilter: (category: string) => set(
      (state) => ({ categoryFilter: state.categoryFilter ? [...state.categoryFilter, category] : [category] })
    ),
    updateItemsTagFilter: (tag: string) => set((state) => ({ tagFilter: state.tagFilter ? [...state.tagFilter, tag] : [tag]})),
    updateModal: (modalOpen: boolean) => set(() => ({ modalOpen })),
    updateEditMode: (inEditMode: boolean) => set(() => ({ inEditMode })),
    updateEditedItem: (inEditMode: boolean) => set(() => ({ inEditMode })),
  }))
}
