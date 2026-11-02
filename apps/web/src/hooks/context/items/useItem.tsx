
import {
  createContext,
  useContext,
} from "react";

import type {
  IViewItemsContext,
  IUpdateItemsContext,
  ISearchItemsContext,
} from "@/domain/entities"


export const ViewItemsContext = createContext<IViewItemsContext | undefined>(undefined);
export function useViewItems() {
  return useContext(ViewItemsContext);
}

export const UpdateItemsContext = createContext<IUpdateItemsContext | undefined>(undefined);
export function useUpdateItems() {
  return useContext(UpdateItemsContext);
}

export const SearchItemsContext = createContext<ISearchItemsContext | undefined>(undefined);
export function useSearchItems() {
  return useContext(SearchItemsContext);
}
