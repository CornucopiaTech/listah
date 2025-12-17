import { create } from 'zustand'
import { createItemsSlice } from './itemsSlice';
import { createItemSlice } from './itemSlice';

export const useBoundStore = create((...a) => ({
  ...createItemsSlice(...a),
  ...createItemSlice(...a),
}))
