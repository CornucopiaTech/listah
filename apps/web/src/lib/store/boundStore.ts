import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ExtractState } from 'zustand';



import { createListingSlice } from './listingSlice';
import { createDetailSlice } from './detailSlice';
import type { IStore } from '@/lib/model/Items';



export const useBoundStore = create <IStore>()(
  persist(
    devtools(
      (...a) => ({
        ...createListingSlice(...a),
        ...createDetailSlice(...a),
      }),
    ),
    { name: 'listing-store' },
  )
);


export type TBoundStore = ExtractState<typeof useBoundStore>
