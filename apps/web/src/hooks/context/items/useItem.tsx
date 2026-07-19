
import {
  createContext,
  useContext,
} from "react";

import type {
  IItemListContext
} from "@/domain/entities"

export const ItemListContext = createContext<IItemListContext | undefined>(undefined);
export function useListItems() {
  return useContext(ItemListContext);
}
