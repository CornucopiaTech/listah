


import type {
  ChangeEvent,
  ReactNode,
} from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import {
  validateName,
} from "@/domain/rules/fieldLength";


const dummyAction = () => undefined;
export function SimpleTextField({ keyName, form }: { keyName: string, form: any }): ReactNode {

  const fieldValidation = keyName == "name" ? validateName : dummyAction;
  const validators = {
    onChange: ({ value }: { value: any }) => fieldValidation(value as unknown as string),
    onBlur: ({ value }: { value: any }) => fieldValidation(value as unknown as string),
  }
  return (
    <form.Field
      key={`item-${keyName}`} name={keyName} validators={validators}
      children={
        (field: any) => (
          <Grid container sx={{ width: '100%' }} spacing={0}>
            <Grid size={12}>
              <TextField
                slotProps={{
                  input: { style: { fontSize: "15px" } },
                  inputLabel: { style: { fontSize: "15px" } },
                }}
                fullWidth
                multiline
                id={`item-${keyName}`}
                key={`item-${keyName}`}
                value={field.state.value}
                label={keyName}
                onChange={
                  (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                size="small"
                variant="standard"
                margin="dense"
                error={field.state.meta.errors.length > 0 || field.state.value == ""}
                helperText={field.state.meta.errors.length > 0 ? field.state.meta.errors.join(', ') : field.state.value == "" ? "tag name is required" : ""}
              />
            </Grid>
          </Grid>
        )
      }
    />
  );
}
