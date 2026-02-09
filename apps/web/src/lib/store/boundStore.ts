import { create } from 'zustand';
import { createListingSlice } from './listingSlice';
import { devtools } from 'zustand/middleware';
import type { ExtractState } from 'zustand';


export const useBoundStore = create(
  devtools((...a) => ({
    ...createListingSlice(...a),
  })
));


export type TBoundStore = ExtractState<typeof useBoundStore>
