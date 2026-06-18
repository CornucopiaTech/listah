
import {
  createContext,
  useContext,
} from "react";


// export const FormContext = createContext<undefined | { form: any, mutation: any }>(undefined);
export const FormContext = createContext<undefined | { form: any, mutation: any }>(undefined);


export function useFormContext() {
  return useContext(FormContext);
}
