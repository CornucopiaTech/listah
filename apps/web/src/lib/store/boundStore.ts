import { create } from 'zustand'
import { createItemsSlice } from './itemsSlice';
import { createItemSlice } from './itemSlice';
import { devtools } from 'zustand/middleware';



export const useBoundStore = create(
  devtools((...a) => ({
    ...createItemsSlice(...a),
    ...createItemSlice(...a),
  })
));
