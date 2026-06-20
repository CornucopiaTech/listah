

import type {
  ReactNode,
} from 'react';
import {
  useStore,
} from "@tanstack/react-form";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';



// Internal imports
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import { FormDialog } from "@/components/layout/FormDialog";
import {
  AppTagFormPropsField,
  AppFormTextField,
} from "@/components/core";
import { useFormContext } from '@/hooks/services/useForm';
import {
  AppUpdateFormActions,
} from "@/components/core";
import { validateName } from '@/domain/rules';
import type {
  IFormContext,
} from "@/domain/entities";


type itemFields = "id" | "userId" | "name" | `props[${number}]`

export function AppTagModal(): ReactNode {
  const store: TAppStore = useAppStore((state) => state);
  const { form, } = useFormContext() as unknown as IFormContext;
  const id = useStore(form.store, (state: any) => state.values.id);


  function closeModal() {
    store.setTagModal(false);
    store.setDisplayTag(undefined);
  }
  const fields: itemFields[] = ['name'];

  // key, form, legend, addValueHeader
  const propsProps = {
    keyName: "props",
    form,
    legend: "properties",
    addValueHeader: "Click here to add a new property",
    newPushValue: "",
  }
  // const dummyAction = (val: any) => undefined;
  const formContent = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        {
          fields.map(
            (fds: itemFields) => (
              <AppFormTextField keyName={fds} form={form}
                validation={validateName}
              />
            )
          )
        }
        <AppTagFormPropsField {...propsProps} />
      </Stack>
    </Box>
  )

  const props = {
    title: id == "" ? "Add new tag" : "Update tag",
    content: formContent,
    actions: <AppUpdateFormActions />,
    openDialog: store.tagModal,
    closeDialog: closeModal,
  }
  return (
    <FormDialog {...props} />
  )
};
