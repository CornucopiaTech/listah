
import {
  createContext,
  useContext,
} from "react";

import type {
  IMutatorContext,
} from "@/domain/entities"




export const MutatorContext = createContext<IMutatorContext | undefined>(undefined);
export function useMutator() {
  return useContext(MutatorContext);
}
