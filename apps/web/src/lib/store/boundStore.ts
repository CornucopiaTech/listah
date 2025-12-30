import { create } from 'zustand'
import { createDetailSlice } from './detailSlice';
import { createListingSlice } from './listingSlice';
import { devtools } from 'zustand/middleware';



export const useBoundStore = create(
  devtools((...a) => ({
    ...createDetailSlice(...a),
    ...createListingSlice(...a),
  })
));
