
import {
  createContext,
  useContext,
} from "react";

import type {
  IViewTagsContext,
  IUpdateTagsContext,
} from "@/app-types"


export const ViewTagsContext = createContext<IViewTagsContext | undefined>(undefined);
export function useViewTags() {
  return useContext(ViewTagsContext);
}

export const UpdateTagsContext = createContext<IUpdateTagsContext | undefined>(undefined);
export function useUpdateTags() {
  return useContext(UpdateTagsContext);
}
