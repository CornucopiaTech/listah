
import type {
  ReactNode,
} from 'react';


// Internal imports


import type {
  IFilter,
} from "@/domain/entities";
import {
  DefaultTag,
} from '@/domain/entities';
import {
  FormDataContext
} from './useForm';



export function TagFormDataProvider({ children, displayTag, }: { children: ReactNode, displayTag?: IFilter }) {
  const formData = displayTag ? displayTag : DefaultTag;
  const isPending = false;
  const isError = false;
  const data = displayTag ? displayTag : DefaultTag;
  const error = null;


  return <FormDataContext.Provider value={{ isPending, isError, data, formData, error }}>
    {children}
  </FormDataContext.Provider>
}
