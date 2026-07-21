
import {
  createContext,
  useContext,
} from "react";

import type {
  ITagListContext,
  ITagUpdateContext,
} from "@/domain/entities"


export const TagListContext = createContext<ITagListContext | undefined>(undefined);
export function useListTags() {
  return useContext(TagListContext);
}


export const TagUpdateContext = createContext<ITagUpdateContext | undefined>(undefined);
export function useUpdateTags() {
  return useContext(TagUpdateContext);
}
