
import {
  createContext,
  useContext,
} from "react";

import type {
  IListContext
} from "@/domain/entities"



export const ListContext = createContext<IListContext | undefined>(undefined);
export function useLists() {
  return useContext(ListContext);
}
