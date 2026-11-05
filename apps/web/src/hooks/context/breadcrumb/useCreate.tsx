
import {
  createContext,
  useContext,
} from "react";

import type {
  ICreateContext,
} from "@/app-types"




export const CreateContext = createContext<ICreateContext | undefined>(undefined);
export function useMutator() {
  return useContext(CreateContext);
}
