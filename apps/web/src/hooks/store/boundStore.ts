import { create } from 'zustand';
import {
  devtools,
} from 'zustand/middleware';
import type { ExtractState } from 'zustand';



import { createTagSlice } from '@/hooks/store/tagSlice';
import { createFilterSlice } from '@/hooks/store/filterSlice';
import { createItemSlice } from '@/hooks/store/itemSlice';
import { createLayoutSlice } from '@/hooks/store/layoutSlice';
import type { IStore } from '@/app-types/store';



export const useAppStore = create<IStore>()(
  devtools(
    (...a) => ({
      ...createTagSlice(...a),
      ...createFilterSlice(...a),
      ...createItemSlice(...a),
      ...createLayoutSlice(...a),
    }),
  ),
);


export type TAppStore = ExtractState<typeof useAppStore>
