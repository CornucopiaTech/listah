import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ExtractState } from 'zustand';
// import type { StateCreator, StoreMutatorIdentifier } from 'zustand';



import { createListingSlice } from './listingSlice';
import { createDetailSlice } from './detailSlice';
import type { IStore } from '@/lib/model/Items';



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



// // Define a type for the middlewares you are using.
// // Example uses 'zustand/devtools' and 'zustand/persist'.
// // Adjust the identifiers based on your actual middlewares.
// type Mutators = [
//   ['zustand/devtools', never],
//   ['zustand/persist', unknown] // Use 'unknown' if the persist options are complex
// ];

// // Utility type for slice creators that handles middleware arguments
// export type ListingStoreSlice<T extends keyof IListingStore> = StateCreator<
//   IListingStore,
//   Mutators, // The mutators your store uses
//   [],
//   IListingStore[T] // The specific slice type
// >;





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
