

import {
  Fragment,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
} from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import { Icon } from "@iconify/react";


// Internal imports
import type { AppTheme } from '@/system/theme';
import {
  ItemFormTagBox,
} from "@/components/core/AppBox";
import {
  validateName,
} from "@/domain/rules/fieldLength";


export function SimpleArrayTextField({ keyName, form, legend, addValueHeader }: { keyName: string, form: any, legend: string, addValueHeader: string, }): ReactNode {
  const theme: AppTheme = useTheme();
  const validators = {
    onChange: ({ value }: { value: any }) => validateName(value as unknown as string),
    onBlur: ({ value }: { value: any }) => validateName(value as unknown as string),
  }
  const legendStyle = { padding: '0 0.5rem', color: theme.palette.primary.main, fontSize: "12px" }
  return (
    <form.Field key={keyName} name={keyName} mode="array" >
      {
        (field: any) => (
          <Fragment>
            {/* @ts-ignore */}
            <ItemFormTagBox component="fieldset">
              <legend style={legendStyle}>{legend}</legend>
              <Button variant="text" color="inherit" onClick={() => field.pushValue("")} >
                {addValueHeader}
              </Button>
              {
                field.state.value && field.state.value.length > 0 &&
                <Grid container spacing={3} sx={{ width: '100%' }}>{
                  field.state.value.map((_: any, i: number) => {
                    const childKeyName = keyName + `[${i}]`;
                    return <form.Field key={i} name={childKeyName}
                      validators={validators}>
                      {
                        (subField: any) => {
                          return (
                            <Grid
                              key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                              size={{ xs: 12, sm: 6, md: 4 }}>
                              <TextField
                                slotProps={{
                                  input: {
                                    style: { fontSize: "15px" },
                                    endAdornment: < Icon icon="material-symbols-light:close-rounded" width="30" height="30"
                                      onClick={() => field.removeValue(i)}
                                    />
                                  },
                                  inputLabel: { style: { fontSize: "15px" } },
                                }}
                                id={"item-tag-" + i}
                                value={subField.state.value}
                                label=""
                                onChange={
                                  (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => subField.handleChange(e.target.value)}
                                size="small"
                                variant="standard"
                                margin="dense"
                                error={subField.state.meta.errors.length > 0 || subField.state.value == ""}
                                helperText={subField.state.meta.errors.length > 0 ? subField.state.meta.errors.join(', ') : subField.state.value == "" ? "property name is required" : ""}
                              />

                            </Grid>
                          )
                        }
                      }
                    </form.Field>
                  })
                }</Grid>
              }
            </ItemFormTagBox>
          </Fragment>
        )
      }
    </form.Field>
  );
}
