import { create } from 'zustand';
import { createListingSlice } from './listingSlice';
import { devtools, persist } from 'zustand/middleware';
import type { ExtractState } from 'zustand';


import type { IListingStore } from '@/lib/model/Items';

// export const useBoundStore = create((...a) => ({
//   ...createBearSlice(...a),
//   ...createFishSlice(...a),
//   ...createBearFishSlice(...a),
// }))

// export const useOtherBoundStore = create(
//   persist(
//     (...a) => ({
//       ...createBearSlice(...a),
//       ...createFishSlice(...a),
//     }),
//     { name: 'bound-store' },
//   ),
// )


export const useBoundStore = create <IListingStore>()(
  persist(
    devtools(
      (...a) => ({
        ...createListingSlice(...a),
      }),
    ),
    { name: 'listing-store' },
  )
);


export type TBoundStore = ExtractState<typeof useBoundStore>
