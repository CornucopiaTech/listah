
import {
  createContext,
  useContext,
} from "react";

import type {
  IFilterListContext
} from "@/domain/entities"


export const FilterListContext = createContext<IFilterListContext | undefined>(undefined);
export function useListFilters() {
  return useContext(FilterListContext);
}
