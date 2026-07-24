
import {
  createContext,
  useContext,
} from "react";

import type {
  ITagListContext,
  ITagFormContext,
} from "@/domain/entities"


export const TagListContext = createContext<ITagListContext | undefined>(undefined);
export function useTagList() {
  return useContext(TagListContext);
}

export const TagUpdateContext = createContext<ITagFormContext | undefined>(undefined);
export function useUpdateTags() {
  return useContext(TagUpdateContext);
}
