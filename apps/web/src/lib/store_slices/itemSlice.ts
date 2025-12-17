import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ItemProto, UpdateItemState, UpdateItemStore } from '@/lib/model/ItemsModel';




export const itemInitState: UpdateItemState = {
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


export const createItemSlice = devtools((set) => ({
  ...itemInitState,
  setItem: (item: ItemProto) => set(() => ({ item })),
  updateSummary: (summary: string) => set(() => ({ item: { summary } })),
  updateCategory: (category: string) => set(() => ({ item: { category } })),
  updateDescription: (description: string) => set((state) => ({ item: { description } })),
  updateNote: (note: string) => set((state) => ({ item: { note } })),
  updateTags: (tags: string[]) => set((state) => ({ item: { tags } })),
  updateSoftDelete: (softDelete: boolean) => set((state) => ({ item: { softDelete } })),
  updateProperties: (properties: { [index: string]: string }) => set((state) => ({ item: { properties } })),
  updateReactivateAt: (reactivateAt: string) => set((state) => ({ item: { reactivateAt } })),
  updateNewTag: (newTag: string) => set(() => ({ newTag })),
  reset: () => set(() => ({ ...itemInitState })),
}))
