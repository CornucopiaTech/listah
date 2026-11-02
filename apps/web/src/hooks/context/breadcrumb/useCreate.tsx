
import {
  createContext,
  useContext,
} from "react";

import type {
  ICreateContext,
} from "@/domain/entities"




export const CreateContext = createContext<ICreateContext | undefined>(undefined);
export function useMutator() {
  return useContext(CreateContext);
}
