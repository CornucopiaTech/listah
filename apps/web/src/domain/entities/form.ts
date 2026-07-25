import type {
  ReactNode,
} from 'react';
import type {
  AppError
} from './common';
import type { ITag } from "./tag";


export type IFilterFormCheckedTag = {
  name: string,
  id: string,
  checked: boolean,
};

export type IFilterForm = {
  name: string,
  id: string,
  tags: Array<IFilterFormCheckedTag>,
  softDelete: boolean,
};

export type IFormDataContext = {
  isPending: boolean,
  isError: boolean,
  data: any,
  formData: any,
  error: Error | null,
}

export type IFormBuilder = {
  name: string,
  mode: string,
  kind: string,
  componentPropGen: () => any,
  legend: string,
  newValueHint: string,
  newValue: any,

}

export type IFormContextWithBuilder = {
  formBuilder: IFormBuilder[],
  defaultValue: any,
  formValidators: ({ value }: { value: any }) => string | undefined,
  prepSubmission: ({ value, userId }: { value: any, userId?: string }) => void,
  mutator: () => any,
  title: string,
  actions: ReactNode,
  openDialog: boolean,
  closeDialog: () => void,
}

export type ITagUpdateContext = {
  openDialog: boolean,
  closeDialog: () => void,
  mutation: any,
  form: any,
  title: string,
}

export type IFilterUpdateContext = {
  openDialog: boolean,
  closeDialog: () => void,
  mutation: any,
  form: any,
  title: string,
  formData: any,
  isPending: boolean,
  error: Error | null | AppError,
  tags: ITag[],
}

export type IItemUpdateContext = {
  openDialog: boolean,
  closeDialog: () => void,
  mutation: any,
  form: any,
  title: string,
  formData: any,
  isPending: boolean,
  error: Error | null | AppError,
  tags: ITag[],
  data: any,
}


export type IFormContext = {
  title: string,
  actions: ReactNode,
  content: ReactNode,
  openDialog: boolean,
  closeDialog: () => void,
  form: any,
  mutation: any,
}
