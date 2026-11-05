
import {
  createContext,
  useContext,
} from "react";

import type {
  IListContext,
  ITableContext,
} from "@/app-types"



export const ListContext = createContext<IListContext | undefined>(undefined);
export function useLists() {
  return useContext(ListContext);
}

export const TableContext = createContext<ITableContext | undefined>(undefined);
export function useTables() {
  return useContext(TableContext);
}
