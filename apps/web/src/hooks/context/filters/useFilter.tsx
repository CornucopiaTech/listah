
import {
  createContext,
  useContext,
} from "react";

import type {
  IViewFiltersContext,
  IUpdateFiltersContext,
} from "@/app-types"


export const ViewFiltersContext = createContext<IViewFiltersContext | undefined>(undefined);
export function useViewFilters() {
  return useContext(ViewFiltersContext);
}


export const UpdateFiltersContext = createContext<IUpdateFiltersContext | undefined>(undefined);
export function useUpdateFilters() {
  return useContext(UpdateFiltersContext);
}
