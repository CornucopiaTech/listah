import { create } from 'zustand';
import {
  devtools,
  // persist
} from 'zustand/middleware';
import type { ExtractState } from 'zustand';



import { createTagSlice } from '@/lib/store/tagSlice';
import { createFilterSlice } from '@/lib/store/filterSlice';
import { createItemSlice } from '@/lib/store/itemSlice';
import { createLayoutSlice } from '@/lib/store/layoutSlice';
import type { IStore } from '@/lib/model/store';



export const useBoundStore = create<IStore>()(
  // persist(
  devtools(
    (...a) => ({
      ...createTagSlice(...a),
      ...createFilterSlice(...a),
      ...createItemSlice(...a),
      ...createLayoutSlice(...a),
      // ...createDetailSlice(...a),
    }),
  ),
  //   { name: 'listing-store' },
  // )
);


export type TBoundStore = ExtractState<typeof useBoundStore>
