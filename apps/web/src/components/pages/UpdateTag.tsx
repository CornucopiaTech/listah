

import type {
  ReactNode,
} from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';



// Internal imports
import type { AppTheme } from '@/system/theme';
import {
  ItemFormTagBox,
} from "@/components/core/AppBox";
import type {
  ITagUpdateContext,
} from "@/domain/entities";
import {
} from "@/domain/entities";
import { FormDialog } from "@/components/layout/FormDialog";
import {
  getFormArrayTextFieldProps,
  getFormTextFieldProps,
} from "@/components/core";
import {
  AppUpdateFormActions,
} from "@/components/core";
import type {

} from "@/domain/entities";
import {
  useUpdateTags
} from '@/hooks/context/tags';
import {
  FormContext,
} from '@/hooks/context/forms';




export function AppTagModal(): ReactNode {
  const theme: AppTheme = useTheme();
  const legendStyle = { padding: '0 0.5rem', color: theme.palette.primary.main, fontSize: "12px" }

  const {
    title,
    isPending,
    error,
    form,
    mutation,
    validator,
    beginUpdate,
    exitUpdate,
  } = useUpdateTags() as unknown as ITagUpdateContext;


  const formContent = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        <form.Field
          key="name"
          name="name"
          validators={validator}
          children={
            (field: any) => <TextField {...getFormTextFieldProps({ key: "name", field, })} />
          }
        />
        <form.Field key="props" name="props" mode="array" >
          {(field: any) => (<ItemFormTagBox component="fieldset">
            <legend style={legendStyle}>"properties"</legend>
            <Button variant="text" color="inherit" onClick={() => field.pushValue("")} >
              "Click here to add a new property"
            </Button>
            {
              field.state.value && field.state.value.length > 0 &&
              <Grid container spacing={3} sx={{ width: '100%' }}>{
                field.state.value && field.state.value.map((_: any, i: number) => {
                  const childKeyName = "props" + `[${i}]`;
                  return <form.Field key={i} name={childKeyName} validators={validator}>
                    {(subField: any) => {
                      return (
                        <Grid size="auto" key={i} /*Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog. */ >
                          <TextField {...getFormArrayTextFieldProps({ key: "props", field, subField, idx: i })} />
                        </Grid>
                      )
                    }}
                  </form.Field>
                })
              }</Grid>
            }
          </ItemFormTagBox>)}
        </form.Field>
      </Stack>
    </Box>
  )

  if (isPending) {
    return <LinearProgress />
  }


  if (error) {
    return <Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert>
  }

  const props = {
    title,
    content: formContent,
    actions: <AppUpdateFormActions />,
    openDialog: beginUpdate,
    closeDialog: exitUpdate,
    form,
    mutation,
  }
  return (
    <FormContext.Provider value={props}>
      <FormDialog />
    </FormContext.Provider>

  )
};
