import { createStore } from 'zustand/vanilla';


import { ItemProto, UpdateItemState, UpdateItemStore } from '@/lib/model/ItemsModel';




export const defaultUpdateItemInitState: UpdateItemState = {
  item: {
    id:  null,
    userId:  null,
    summary:  null,
    category:  null,
    description:  null,
    note:  null,
    tags:  null,
    softDelete:  null,
    properties:  null,
    reactivateAt:  null,
    audit: null
  },
  newTag: null
}


export const createUpdatedItemStore = (
  initState: UpdateItemState = defaultUpdateItemInitState,
) => {
  return createStore<UpdateItemStore>()((set) => ({
    ...initState,
    setState: (item: ItemProto) => set(() => ({ item })),
    updateSummary: (summary: string) => set((state) => ({ ...state, item: {...state.item, summary }})),
    updateCategory: (category: string) => set((state) => ({ ...state, item: { ...state.item, category }})),
    updateDescription: (description: string) => set((state) => ({ ...state, item: { ...state.item,description }})),
    updateNote: (note: string) => set((state) => ({ ...state, item: { ...state.item, note }})),
    updateTags: (tags: string[]) => set((state) => ({ ...state, item: { ...state.item, tags }})),
    updateSoftDelete: (softDelete: boolean) => set((state) => ({ ...state, item: { ...state.item, softDelete }})),
    updateProperties: (properties: { [index: string]: string }) => set((state) => ({ ...state, item: { ...state.item, properties }})),
    updateReactivateAt: (reactivateAt: string) => set((state) => ({ ...state, item: { ...state.item, reactivateAt }})),
    updateNewTag: (newTag: string) => set(() => ({ newTag })),
  }))
}
