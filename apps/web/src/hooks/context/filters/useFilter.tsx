
import {
  createContext,
  useContext,
} from "react";

import type {
  IFilterListContext,
  IFilterUpdateContext,
} from "@/domain/entities"


export const FilterListContext = createContext<IFilterListContext | undefined>(undefined);
export function useListFilters() {
  return useContext(FilterListContext);
}


export const FilterUpdateContext = createContext<IFilterUpdateContext | undefined>(undefined);
export function useUpdateFilters() {
  return useContext(FilterUpdateContext);
}
