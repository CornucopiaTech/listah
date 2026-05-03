import { create } from 'zustand';
import {
  devtools,
  // persist
} from 'zustand/middleware';
import type { ExtractState } from 'zustand';



import { createHomeSlice } from '@/lib/store/homeSlice';
import { createItemSlice } from '@/lib/store/itemSlice';
import { createListingSlice } from '@/lib/store/listingSlice';
import { createDetailSlice } from '@/lib/store/detailSlice';
import type { IStore } from '@/lib/model/store';



export const useBoundStore = create<IStore>()(
  // persist(
  devtools(
    (...a) => ({
      ...createHomeSlice(...a),
      ...createItemSlice(...a),
      ...createListingSlice(...a),
      ...createDetailSlice(...a),
    }),
  ),
  //   { name: 'listing-store' },
  // )
);


export type TBoundStore = ExtractState<typeof useBoundStore>
