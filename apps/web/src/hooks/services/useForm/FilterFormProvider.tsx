
import type {
  ReactNode,
} from 'react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useUser
} from '@clerk/react';


import {
  DefaultFilter
} from "@/domain/entities";
import type {
  IFilter,
} from "@/domain/entities";
import {
  prepFilterUpdate,
  filterFormValidator,
} from "@/domain/rules";
import {
  useUpdateFilter
} from "@/hooks/queries";
import { FormContext } from "@/hooks/services/useForm/useForm";



export function FilterFormProvider({ children, displayFilter }: { children: ReactNode, displayFilter?: IFilter }) {
  const formFilter: IFilter = displayFilter ? displayFilter : DefaultFilter;
  const { user } = useUser();
  const mutation = useUpdateFilter();
  const formSubmission = ({ value }: { value: IFilter }) => {
    const submitValue = prepFilterUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
  };

  const form = useForm({
    defaultValues: { ...formFilter },
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IFilter }) {
        return filterFormValidator({ value });
      },
      onBlur({ value }: { value: IFilter }) {
        return filterFormValidator({ value });
      },
    },
  });

  return <FormContext.Provider value={{ form, mutation }}>
    {children}
  </FormContext.Provider>
}
