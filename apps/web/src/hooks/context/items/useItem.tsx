
import {
  createContext,
  useContext,
} from "react";

import type {
  IItemListContext,
  IItemFormContext,
} from "@/domain/entities"


export const ItemListContext = createContext<IItemListContext | undefined>(undefined);
export function useListItems() {
  return useContext(ItemListContext);
}

export const ItemUpdateContext = createContext<IItemFormContext | undefined>(undefined);
export function useUpdateItems() {
  return useContext(ItemUpdateContext);
}
