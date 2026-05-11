import type { StateCreator } from 'zustand';



import type { IItem } from '@/lib/model/item';
import type {
  IItemState,
  IItemSlice,
  IStore,
} from '@/lib/model/store';
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";
import { DefaultItem, } from '../helper/defaults';




export const itemInitState: IItemState = {
  message: "",
  itemModal: false,
  displayItem: DefaultItem,
  itemSearchQuery: '',
  itemTitle: undefined,
  itemReference: undefined,
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
  reset: () => set(itemInitState),
});
