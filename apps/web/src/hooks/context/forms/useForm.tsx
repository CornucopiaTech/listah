
import {
  createContext,
  useContext,
} from "react";

import type {
  IFormContext
} from "@/app-types"



export const FormContext = createContext<IFormContext | undefined>(undefined);
export function useForms() {
  return useContext(FormContext);
}
