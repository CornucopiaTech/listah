import { create } from 'zustand';
import { createStore } from 'zustand/vanilla';

import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';

export type ItemState = {
  id: string | null,
  userId: string | null,
  title: string | null,
  summary: string | null,
  category: string | null,
  description: string | null,
  note: string | null,
  tags: string[] | null,
  softDelete: boolean | null,
  properties: { [index: string]: string } | null
  reactivateAt: string | null,
  newTag: string | null,
}

export type UpdateItemState = {
  item: ItemState
  newTag: string | null,
}

export type UpdateItemActions = {
  setState: (item: ItemState) => void
  updateSummary: (summary: string) => void
  updateCategory: (category: string) => void
  updateDescription: (description: string) => void
  updateNote: (note: string) => void
  updateTags: (tags: string[]) => void
  updateSoftDelete: (softDelete: boolean) => void
  updateProperties: (properties: { [index: string]: string }) => void
  updateReactivateAt: (reactivateAt: string) => void
  updateNewTag: (newTag: string) => void
}

export type UpdateItemStore = UpdateItemState & UpdateItemActions
export const defaultUpdateItemInitState: UpdateItemState = {
  item: {
    id:  null,
    userId:  null,
    title:  null,
    summary:  null,
    category:  null,
    description:  null,
    note:  null,
    tags:  null,
    softDelete:  null,
    properties:  null,
    reactivateAt:  null,
    newTag: null,
  },
  newTag: null
}


export const createUpdatedItemStore = (
  initState: UpdateItemState = defaultUpdateItemInitState,
) => {
  return createStore<UpdateItemStore>()((set) => ({
    ...initState,
    setState: (item: ItemState) => set(() => ({ item })),
    updateSummary: (summary: string) => set((state) => ({ ...state, item: {...state.item, summary }})),
    updateCategory: (category: string) => set((state) => ({ ...state, item: { ...state.item, category }})),
    updateDescription: (description: string) => set((state) => ({ ...state, item: { ...state.item,description }})),
    updateNote: (note: string) => set((state) => ({ ...state, item: { ...state.item, note }})),
    updateTags: (tags: string[]) => set((state) => ({ ...state, item: { ...state.item, tags }})),
    updateSoftDelete: (softDelete: boolean) => set((state) => ({ ...state, item: { ...state.item, softDelete }})),
    updateProperties: (properties: { [index: string]: string }) => set((state) => ({ ...state, item: { ...state.item, properties }})),
    updateReactivateAt: (reactivateAt: string) => set((state) => ({ ...state, item: { ...state.item, reactivateAt }})),
    updateNewTag: (newTag: string) => set((state) => ({ ...state, item: { ...state.item, newTag }})),
  }))
}
