
import {
  createContext,
  useContext,
} from "react";

import type {
  IPagingContext,
} from "@/domain/entities"



export const PagingContext = createContext<IPagingContext | undefined>(undefined);
export function usePaging() {
  return useContext(PagingContext);
}
