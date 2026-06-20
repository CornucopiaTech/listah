

import type {
  ReactNode,
} from 'react';
import {
  useStore,
} from "@tanstack/react-form";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LinearProgress from "@mui/material/LinearProgress";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';




// Internal imports
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import {
  DefaultItem
} from "@/domain/entities";
import type {
  IFormDataContext,
  IFormContext,
} from "@/domain/entities";
import {
  useFormDataContext,
  useFormContext,
} from "@/hooks/services/useForm/useForm";
import { FormDialog } from "@/components/layout/FormDialog";
import {
  validateName,
} from "@/domain/rules/fieldLength";
import {
  AppFormTextField,
  AppUpdateFormActions,
  AppItemFormTagAutocompleteField,
  AppItemFormPropTextField,
} from "@/components/core";







type itemFields = "id" | "userId" | "name" | "note" | `props[${number}]` | "softDelete" | `tags[${number}]`


export function AppItemModal(): ReactNode {
  const store: TAppStore = useAppStore((state) => state);
  const { form, } = useFormContext() as unknown as IFormContext;
  const { isPending, isError, data, formData, error } = useFormDataContext() as unknown as IFormDataContext;
  const id = useStore(form.store, (state: any) => state.values.id);
  function closeModal() {
    store.setItemModal(false);
    store.setDisplayItem(DefaultItem);
  }

  const dummyAction = undefined;
  const fields: itemFields[] = ['name', "note"];


  let formContent;
  let formAction = undefined;
  if (isPending) {
    formContent = <LinearProgress />;
  }
  if (isError) {
    formContent = (
      <Alert severity="error"> {error?.message || "An error occurred. Please try again"}</Alert>
    );
  }
  if (!data || !data.tags || data.tags.length == 0) {
    formContent = (
      <Typography variant="h6"> No tags found </Typography>
    );
  }
  if (data && data.tags && data.tags.length > 0 && formData) {
    formContent = (
      <Box component="section" >
        <Stack spacing={0} sx={{ width: '100%' }} >
          {fields.map(
            (fds: itemFields) => <AppFormTextField
              keyName={fds} form={form}
              validation={fds == "name" ? validateName : dummyAction}
            />
          )}
          <AppItemFormPropTextField />
          <AppItemFormTagAutocompleteField />
        </Stack>
      </Box>
    );
    formAction = <AppUpdateFormActions />
  }


  const props = {
    title: id == "" ? "Add new item" : "Update item",
    content: formContent,
    actions: formAction,
    openDialog: store.itemModal,
    closeDialog: closeModal,
  }
  return <FormDialog {...props} />

}
