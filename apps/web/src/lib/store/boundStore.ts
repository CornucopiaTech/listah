import { create } from 'zustand'
import { createListingSlice } from './listingSlice';
import { devtools } from 'zustand/middleware';



export const useBoundStore = create(
  devtools((...a) => ({
    ...createListingSlice(...a),
  })
));
