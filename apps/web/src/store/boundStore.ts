import { create } from 'zustand';
import {
  devtools,
  persist,
} from 'zustand/middleware';
import type { ExtractState } from 'zustand';



import { createTagSlice } from '@/store/tagSlice';
import { createFilterSlice } from '@/store/filterSlice';
import { createItemSlice } from '@/store/itemSlice';
import { createLayoutSlice } from '@/store/layoutSlice';
import type { IStore } from '@/entities/store';



export const useAppStore = create<IStore>()(
  persist(
    devtools(
      (...a) => ({
        ...createTagSlice(...a),
        ...createFilterSlice(...a),
        ...createItemSlice(...a),
        ...createLayoutSlice(...a),
      }),
    ),
    { name: 'listah-store' },
  )
);


export type TAppStore = ExtractState<typeof useAppStore>
