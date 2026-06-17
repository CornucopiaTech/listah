import type { StateCreator } from 'zustand';



import type {
  IItem
} from '@/domain/entities/item';
import type {
  IItemState,
  IItemSlice,
  IStore,
} from '@/domain/entities/store';
import type {
  ITag,
} from "@/domain/entities/tag";
import type {
  IFilter,
} from "@/domain/entities/filter";
import {
  DefaultItem,
} from '@/utils/defaults';




export const itemInitState: IItemState = {
  message: "",
  itemModal: false,
  displayItem: DefaultItem,
  itemSearchQuery: '',
  itemTitle: undefined,
  itemReference: undefined,
  itemScroll: 0,
}

export const createItemSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  IItemSlice
> = (set) => ({
  ...itemInitState,
  setMessage: (message: string) => set(() => ({ message })),
  setItemModal: (itemModal: boolean) => set(() => ({ itemModal })),
  setDisplayItem: (displayItem: IItem) => set(() => ({ displayItem })),
  setItemSearchQuery: (itemSearchQuery: string) => set(() => ({ itemSearchQuery })),
  setItemTitle: (itemTitle: string) => set(() => ({ itemTitle })),
  setItemReference: (itemReference: undefined | ITag | IFilter) => set(() => ({ itemReference })),
  setItemScroll: (itemScroll: undefined | number) => set(() => ({ itemScroll })),
  reset: () => set(itemInitState),
});
