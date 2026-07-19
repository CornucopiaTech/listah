
import {
  createContext,
  useContext,
} from "react";

import type {
  IItemDataContext
} from "@/domain/entities"

export const ItemDataContext = createContext<IItemDataContext | undefined>(undefined);
export function useItems() {
  return useContext(ItemDataContext);
}
