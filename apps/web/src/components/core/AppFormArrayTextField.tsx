

import {
  Fragment,
  useState,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useTheme } from "@mui/material";
import Button from '@mui/material/Button';
import { Icon } from "@iconify/react";
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';




// Internal imports
import type { AppTheme } from '@/system/theme';
import {
  ItemFormTagBox,
} from "@/components/core/AppBox";
import {
  validateName,
  validateItemTag,
} from "@/domain/rules/fieldLength";
import {
  useFormContext,
  useFormDataContext
} from '@/hooks/services/useForm/useForm';
import type {
  IItemFormProps,
  ITag,
  IFormDataContext,
  IFormContext,
} from "@/domain/entities";
import {
  DefaultTag,
} from "@/domain/entities";
import { AlertDialog } from "@/components/layout/AlertDialog";


const textSlopProps = {
  input: { style: { fontSize: "1rem" }, },
  inputLabel: { style: { fontSize: "1rem" } },
}


export function AppArrayTextField({ keyName, field, subField, i }: { keyName: string, field: any, subField: any, i: number }): ReactNode {
  return (
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
      id={keyName + "-" + i}
      value={subField.state.value}
      label=""
      onChange={
        (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => subField.handleChange(e.target.value)}
      size="small"
      variant="standard"
      margin="dense"
      error={subField.state.meta.errors.length > 0 || subField.state.value == ""}
      helperText={subField.state.meta.errors.length > 0 ? subField.state.meta.errors.join(', ') : subField.state.value == "" ? "required" : ""}
    />
  );
}


export function AppItemFormTagAutocompleteField(): ReactNode {
  const { form, } = useFormContext() as unknown as IFormContext;
  const { formData, data } = useFormDataContext() as unknown as IFormDataContext;
  const { knownTags } = formData;
  const theme: AppTheme = useTheme();
  const [tagToDelete, setTagToDelete] = useState<{ c: any, p: any } | null>(null);
  const serverTags = data?.tags ?? [];



  function addNewTagProps({ value }: any) {
    const oldProps = form.getFieldValue('props');
    let newPropList: string[] = [];
    (value as ITag[]).forEach((iterTag: ITag) => {
      const iterTagProps = iterTag?.props ?? []
      newPropList = [...newPropList, ...iterTagProps]
    }, []);
    newPropList = [...new Set(newPropList)].sort()
    let newProps: IItemFormProps[] = [];
    newPropList.filter(i => i !== "").forEach(
      (iterProp: string) => {
        const inOldProp = oldProps.filter((i: IItemFormProps) => i.key == iterProp)
        if (inOldProp.length == 0) {
          newProps = [...newProps, { key: iterProp, value: "" }]
        } else {
          newProps = [...newProps, { key: iterProp, value: inOldProp[0].value || "" }]
        }
      }
    )
    // console.info('addNewTagProps', newProps)
    newProps = newProps.sort((a: IItemFormProps, b: IItemFormProps) => b.value.localeCompare(a.value))
    form.setFieldValue('props', newProps)
  }

  function handleTagsChange(parentF: any, childF: any, newValue: string | null) {
    const sval = newValue ? newValue : "";
    if (sval == "") {
      // If the value was deleted, replace the tag object with the default tag object.
      // @ts-ignore
      setTagToDelete({ c: childF, p: parentF });
    } else {
      // If a nonzero value is added, then use the information to update the tag object.
      handleTagAdd(parentF, childF, newValue)
    }
  }

  function handleTagAdd(parentF: any, childF: any, newValue: string | null) {
    const sval = newValue ? newValue : "";
    const fField = parentF?.state?.value as unknown as ITag[] ?? [];

    // If a nonzero value is added, then use the information to update the tag object.
    const it = serverTags.filter((itt: ITag) => itt.name == sval);
    if (it.length > 0) {
      // If the passed value is a known name of a tag..
      childF.handleChange(it[0]);
      addNewTagProps({ value: [...fField, it[0]] })
    }
    else {
      childF.handleChange({ ...DefaultTag, name: sval });
    }
  }

  function handleTagDeletePostConfirm(uInput: boolean) {
    // if (yesDelete) {
    if (uInput) {
      // @ts-ignore
      const par = tagToDelete?.p;
      // @ts-ignore
      const chd = tagToDelete?.c;
      const fField = par?.state?.value as unknown as ITag[] ?? [];
      const newTagList = fField.filter(fsv => fsv.id != chd.state.value.id);
      addNewTagProps({ value: newTagList });
      if (newTagList.filter(itt => itt.name !== "").length >= 1) {
        const removeIdx = par.state.value.map(
          (iF: ITag) => iF.id
        ).indexOf(chd.state.value.id);
        if (removeIdx > -1) {
          par.removeValue(removeIdx);
        }
      } else {
        chd.handleChange(DefaultTag);
      }
    }
    setTagToDelete(null);
  }

  const dialogTitle = tagToDelete?.c?.state.value.name ?? "";
  const dialogContent = (
    <Fragment>
      <Typography variant="body2">
        Deleting this tag will remove the following item properties:
      </Typography>

      <List>
        {/* @ts-ignore */}
        {tagToDelete?.c?.state.value.props.map((tp) =>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary={
                  <Typography variant="condensedBody2" >{tp}</Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Fragment>
  );


  const dialogActions = (
    <Stack direction="row" spacing={4}>
      <Button variant="contained" onClick={() => handleTagDeletePostConfirm(false)}>Cancel</Button>
      <Button variant="contained" color="error" onClick={() => handleTagDeletePostConfirm(true)}> Delete </Button>
    </Stack>
  );


  const validator = {
    onChange: ({ value }: { value: ITag }) => validateItemTag(value as unknown as ITag, knownTags.current),
    onBlur: ({ value }: { value: ITag }) => validateItemTag(value as unknown as ITag, knownTags.current),
  };

  return (
    <form.Field name="tags" mode="array" key="tag-parent" >
      {
        (field: any) => {
          return <Fragment>
            <AlertDialog
              openDialog={tagToDelete !== null}
              title={dialogTitle}
              content={dialogContent}
              actions={dialogActions}
            />
            {/* @ts-ignore */}
            <ItemFormTagBox key="tags" component="fieldset">
              <legend style={{ padding: '0 0.5rem', color: theme.palette.primary.main, fontSize: "12px" }}>tags</legend>
              <Button variant="text" color="inherit" onClick={() => field.pushValue(DefaultTag)} >
                Click here to add a new tag
              </Button>
              {
                field.state.value && field.state.value.length > 0 &&
                <Grid container spacing={3} sx={{ width: '100%' }}>{
                  field.state.value && field.state.value.map((_: any, i: number) => {
                    return (
                      <form.Field key={i} name={`tags[${i}]`} validators={validator} >{
                        (subField: any) => {
                          return (
                            <Grid
                              key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                              size={{ xs: 12, sm: 6, lg: 4 }}>
                              <Autocomplete
                                slotProps={{ listbox: { sx: { fontSize: '14px', } }, }}
                                size="small"
                                id={"item-tag-" + i}
                                autoHighlight
                                options={serverTags.map((opt: ITag) => opt.name)}
                                value={subField.state.value.name}
                                inputValue={subField.state.value.name}
                                onChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string | null) => {
                                    // Handles ONLY changes from the provided options.
                                    e && e.preventDefault();
                                    e && e.stopPropagation();
                                    handleTagsChange(field, subField, newValue);
                                  }
                                }
                                onInputChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string) => {
                                    // Handles both handwritten and provided option value changes.
                                    e && e.preventDefault();
                                    e && e.stopPropagation();
                                    handleTagsChange(field, subField, newValue);
                                  }
                                }
                                renderInput={
                                  (params) =>
                                    <TextField
                                      error={subField.state.meta.errors.length > 0}
                                      helperText={subField.state.meta.errors.join(', ')}
                                      // slotProps causes autocorrect to stop working
                                      margin="dense"
                                      {...params}
                                      label=""
                                      // label={"tag " + (i + 1)}
                                      variant="standard"
                                    />
                                }
                              />
                            </Grid>
                          )
                        }
                      }</form.Field>
                    );
                  })
                }</Grid>
              }
            </ItemFormTagBox>
          </Fragment>
        }
      }
    </form.Field >
  );

}


export function AppItemFormPropTextField(): ReactNode {
  const { form, } = useFormContext() as unknown as IFormContext;
  return (
    <form.Field name="props" mode="array">
      {
        (field: any) => (
          <Fragment >
            {
              field.state.value &&
              field.state.value.map((_: any, i: number) => {
                return <form.Field key={"item-prop-key-" + i} name={`props[${i}]`}>{
                  (subField: any) => {
                    return (
                      <TextField
                        slotProps={textSlopProps}
                        multiline
                        id={"item-prop-key-" + i}
                        value={subField.state.value.value}
                        label={subField.state.value.key}
                        onChange={
                          (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                            subField.handleChange({ ...subField.state.value, value: e.target.value })
                        }
                        size="small"
                        variant="standard"
                        margin="dense"
                      />
                    )
                  }
                }</form.Field>
              })
            }
          </Fragment>
        )
      }
    </form.Field>
  );
}


// ToDo: get form from context and do not pass it down as prop
export function FormArrayTextField(
  { keyName, form, legend, addValueHeader,
    newPushValue, childComponent }: {
      keyName: string, form: any, legend?: string,
      addValueHeader: string, newPushValue: any,
      childComponent?: any
    }): ReactNode {
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
            <ItemFormTagBox component={legend && "fieldset"}>
              {legend && <legend style={legendStyle}>{legend}</legend>}
              <Button variant="text" color="inherit" onClick={() => field.pushValue(newPushValue)} >
                {addValueHeader}
              </Button>
              {
                field.state.value && field.state.value.length > 0 &&
                <Grid container spacing={3} sx={{ width: '100%' }}>{
                  field.state.value && field.state.value.map((_: any, i: number) => {
                    const childKeyName = keyName + `[${i}]`;
                    return <form.Field key={i} name={childKeyName}
                      validators={validators}>
                      {
                        (subField: any) => {
                          return (
                            <Grid
                              key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                              size={{ xs: 12, sm: 6, md: 4 }}>
                              {
                                childComponent ? childComponent({ field, subField, i }) : <AppArrayTextField {...{ field, subField, keyName, i }} />
                              }
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

export function AppTagFormPropsField(
  { keyName, form, legend, addValueHeader,
    newPushValue, childComponent }: {
      keyName: string, form: any, legend?: string,
      addValueHeader: string, newPushValue: any,
      childComponent?: any
    }): ReactNode {
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
            <ItemFormTagBox component={legend && "fieldset"}>
              {legend && <legend style={legendStyle}>{legend}</legend>}
              <Button variant="text" color="inherit" onClick={() => field.pushValue(newPushValue)} >
                {addValueHeader}
              </Button>
              {
                field.state.value && field.state.value.length > 0 &&
                <Grid container spacing={3} sx={{ width: '100%' }}>{
                  field.state.value && field.state.value.map((_: any, i: number) => {
                    const childKeyName = keyName + `[${i}]`;
                    return <form.Field key={i} name={childKeyName}
                      validators={validators}>
                      {
                        (subField: any) => {
                          return (
                            <Grid
                              key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                              size={{ xs: 12, sm: 6, md: 4 }}>
                              {
                                childComponent ? childComponent({ field, subField, i }) : <AppArrayTextField {...{ field, subField, keyName, i }} />
                              }
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
