import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ItemProto, IDetailState } from '@/lib/model/ItemsModel';




export const detailInitState: IDetailState = {
  item: {
    id:  null,
    userId:  null,
    summary:  null,
    category:  null,
    description:  null,
    note:  null,
    tag:  null,
    softDelete:  null,
    properties:  null,
    reactivateAt:  null,
    audit: null
  },
  newTag: null
}


export const createDetailSlice = (set) => ({
  ...detailInitState,
  setItem: (item: ItemProto) => set(() => ({ item })),
  setSummary: (summary: string) => set((state) => ({ item: { ...state.item, summary } })),
  setCategory: (category: string) => set((state) => ({ item: { ...state.item, category } })),
  setDescription: (description: string) => set((state) => ({ item: { ...state.item, description } })),
  setNote: (note: string) => set((state) => ({ item: { ...state.item, note } })),
  setTags: (tags: string[]) => set((state) => ({ item: { ...state.item, tags } })),
  setSoftDelete: (softDelete: boolean) => set((state) => ({ item: { ...state.item, softDelete } })),
  setProperties: (properties: { [index: string]: string }) => set((state) => ({ item: { ...state.item, properties } })),
  setReactivateAt: (reactivateAt: string) => set((state) => ({ item: { ...state.item, reactivateAt } })),
  setNewTag: (newTag: string) => set(() => ({ newTag })),
  reset: () => set(() => ({ ...detailInitState })),
});
