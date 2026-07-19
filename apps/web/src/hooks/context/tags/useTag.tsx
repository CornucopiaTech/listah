
import {
  createContext,
  useContext,
} from "react";

import type {
  ITagListContext
} from "@/domain/entities"


export const TagListContext = createContext<ITagListContext | undefined>(undefined);
export function useListTags() {
  return useContext(TagListContext);
}
