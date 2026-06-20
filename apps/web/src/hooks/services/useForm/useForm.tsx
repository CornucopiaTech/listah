
import {
  createContext,
  useContext,
} from "react";

import type {
  IFormDataContext
} from "@/domain/entities"


// export const FormContext = createContext<undefined | { form: any, mutation: any }>(undefined);
export const FormContext = createContext<{ form: any, mutation: any } | undefined>(undefined);


export function useFormContext() {
  return useContext(FormContext);
}
export const FormDataContext = createContext<IFormDataContext | undefined>(undefined);


export function useFormDataContext() {
  return useContext(FormDataContext);
}
