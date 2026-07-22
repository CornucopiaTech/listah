
import {
  createContext,
  useContext,
} from "react";

import type {
  ITagListContext,
  ITagUpdateContext,
  ITagRouteContext,
} from "@/domain/entities"


export const TagListContext = createContext<ITagListContext | undefined>(undefined);
export function useListTags() {
  return useContext(TagListContext);
}

export const TagRouteContext = createContext<ITagRouteContext | undefined>(undefined);
export function useRouteTags() {
  return useContext(TagRouteContext);
}


export const TagUpdateContext = createContext<ITagUpdateContext | undefined>(undefined);
export function useUpdateTags() {
  return useContext(TagUpdateContext);
}
