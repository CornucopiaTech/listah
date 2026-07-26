
import {
  createContext,
  useContext,
} from "react";

import type {
  IFormContext
} from "@/domain/entities"



export const FormContext = createContext<IFormContext | undefined>(undefined);
export function useForms() {
  return useContext(FormContext);
}
