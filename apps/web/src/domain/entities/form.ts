


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

export type IFormContext = {
  form: any,
  mutation: any,
}
