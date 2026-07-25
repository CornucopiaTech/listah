


import type {
  ChangeEvent,
} from 'react';
import { Icon } from "@iconify/react";


const textSlopProps = {
  input: { style: { fontSize: "1rem" }, },
  inputLabel: { style: { fontSize: "1rem" } },
}


export function getFormArrayTextFieldProps({ key, field, subField, idx }: { key: string, field: any, subField: any, idx: number }) {
  return {
    multiline: true,
    slotProps: {
      input: {
        style: { fontSize: "15px" },
        endAdornment: (
          < Icon icon="material-symbols-light:close-rounded" width="30" height="30"
            onClick={() => field.removeValue(idx)}
          />
        )
      },
      inputLabel: { style: { fontSize: "15px" } },
    },
    id: key + "-" + idx,
    value: subField.state.value,
    label: "",
    onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => subField.handleChange(e.target.value),
    size: "small",
    variant: "standard",
    margin: "dense",
  }
}

export function getFormItemPropsArrayTextFieldProps({ key, field, subField, idx }: { key: string, field: any, subField: any, idx: number }) {
  const err = subField.state.meta.errors.length > 0 || subField.state.value == "";
  const helpText = subField.state.meta.errors.length > 0 ? subField.state.meta.errors.join(', ') : subField.state.value == "" ? "required" : "";
  return {
    fullWidth: true,
    multiline: true,
    slotProps: {
      ...textSlopProps,
      input: {
        ...textSlopProps.input,
        endAdornment: (
          < Icon icon="material-symbols-light:close-rounded" width="30" height="30"
            onClick={() => field.removeValue(idx)}
          />
        ),
      },
    },
    id: key + "-" + idx,
    value: subField.state.value.value,
    label: subField.state.value.key,

    onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      subField.handleChange({ ...subField.state.value, value: e.target.value }),
    size: "small",
    variant: "standard",
    margin: "dense",
    error: err,
    helperText: helpText,
  }
}

export function getFormTextFieldProps({ key, field, }: { key: string, field: any, }) {
  const error = field.state.meta.errors.length > 0 || (key == "name" && field.state.value == "");
  const helperText = field.state.meta.errors.length > 0 ? field.state.meta.errors.join(', ') : (key == "name" && field.state.value == "") ? "name is required" : ""


  return {
    fullWidth: true,
    multiline: true,
    slotProps: {
      input: {
        style: { fontSize: "15px" },
        endAdornment: (
          < Icon icon="material-symbols-light:close-rounded" width="30" height="30"
            onClick={() => field.handleChange("")}
          />
        )
      }
    },
    id: key,
    key,
    value: field.state.value,
    label: key,
    onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value),
    size: "small",
    variant: "standard",
    margin: "dense",
    error: error,
    helperText: helperText,
  }
}
