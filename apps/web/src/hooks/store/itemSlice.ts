import type { StateCreator } from 'zustand';



import type {
  IItem,
  IItemState,
  IItemSlice,
  IStore,
  ITag,
  IFilter,
} from "@/app-types";
import {
  DefaultItem,
} from "@/app-types";




export const itemInitState: IItemState = {
  message: "",
  itemModal: false,
  displayItem: DefaultItem,
  itemSearchQuery: '',
  itemTitle: undefined,
  itemReference: undefined,
  itemScroll: 0,
  itemsChecked: new Set([]),
  allItemsChecked: false,
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
  setItemsChecked: (itemsChecked: Set<string>) => set(() => ({ itemsChecked })),
  setAllItemsChecked: (allItemsChecked: boolean) => set(() => ({ allItemsChecked })),
  reset: () => set(itemInitState),
});
