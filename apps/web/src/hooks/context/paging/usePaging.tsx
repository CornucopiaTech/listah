
import {
  createContext,
  useContext,
} from "react";

import type {
  IPagingContext,
} from "@/app-types"



export const PagingContext = createContext<IPagingContext | undefined>(undefined);
export function usePaging() {
  return useContext(PagingContext);
}
