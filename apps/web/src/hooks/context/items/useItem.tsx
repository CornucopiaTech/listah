
import {
  createContext,
  useContext,
} from "react";

import type {
  IItemListContext,
  IItemUpdateContext,
  IItemSearchContext,
} from "@/domain/entities"


export const ItemListContext = createContext<IItemListContext | undefined>(undefined);
export function useListItems() {
  return useContext(ItemListContext);
}

export const ItemUpdateContext = createContext<IItemUpdateContext | undefined>(undefined);
export function useUpdateItems() {
  return useContext(ItemUpdateContext);
}

export const ItemSearchContext = createContext<IItemSearchContext | undefined>(undefined);
export function useSearchItems() {
  return useContext(ItemSearchContext);
}
