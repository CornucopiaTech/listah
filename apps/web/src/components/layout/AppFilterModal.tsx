

import type {
  ReactNode,
} from 'react';
import {
  useStore,
} from "@tanstack/react-form";
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { VirtuosoGrid } from 'react-virtuoso'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';




// Internal imports

import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
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
  getGridComponent,
  AppUpdateFormActions,
} from "@/components/core";
import type {
  IFormContext,
  IFormDataContext,
} from '@/domain/entities'


export function AppFilterModal(): ReactNode {
  const store: TAppStore = useAppStore((state) => state);
  const { form, } = useFormContext() as unknown as IFormContext;
  const { isPending, isError, data, formData, error } = useFormDataContext() as unknown as IFormDataContext;
  const id = useStore(form.store, (state: any) => state.values.id);

  function closeModal() {
    store.setFilterModal(false);
    store.setDisplayFilter(undefined);
  }
  const gridComponents = getGridComponent();
  function renderCell(idx: number): ReactNode {
    return (
      <form.Field name={`tags[${idx}]`}
        children={(field: any) => {
          const lbl = !field.state.value ? "" : field.state.value.name
          return (
            <FormControlLabel control={
              <Checkbox
                checked={field.state.value?.checked}
                onChange={() => {
                  field.handleChange({ ...field.state.value, checked: !field.state.value.checked })
                }}
                slotProps={{
                  input: { 'aria-label': 'controlled' },
                }}
              />
            } label={lbl} />
          );
        }}
      />
    )
  }

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
        <AppFormTextField
          keyName="name" form={form}
          validation={validateName}
        />
        <VirtuosoGrid
          style={{ height: "40vh" }}
          totalCount={data.tags.length}
          // @ts-ignore
          components={gridComponents}
          itemContent={(index) => renderCell(index)}
        />
      </Box>
    );
    formAction = <AppUpdateFormActions />
  }


  const props = {
    title: id == "" ? "Add new filter" : "Update filter",
    content: formContent,
    actions: formAction,
    openDialog: store.filterModal,
    closeDialog: closeModal,
  }
  return <FormDialog {...props} />

}
