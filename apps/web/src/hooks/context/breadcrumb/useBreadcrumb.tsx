
import {
  createContext,
  useContext,
} from "react";

import type {
  IBreadcrumbContext,
} from "@/app-types"




export const BreadcrumbContext = createContext<IBreadcrumbContext | undefined>(undefined);
export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
