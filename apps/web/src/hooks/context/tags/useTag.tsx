
import {
  createContext,
  useContext,
} from "react";

import type {
  ITagDataContext
} from "@/domain/entities"


export const TagDataContext = createContext<ITagDataContext | undefined>(undefined);
export function useTags() {
  return useContext(TagDataContext);
}
