
import {
  Fragment,
  useEffect,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';

import {
  useForm,
  useStore,
} from "@tanstack/react-form";
import {
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import type {
  UseQueryResult,
} from '@tanstack/react-query';
import {
  v4 as uuidv4,
} from 'uuid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import { LinearProgress, useTheme } from "@mui/material";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';



// Internal imports
import {
  AppSubtitle1Typography,

} from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DefaultItem } from '@/lib/helper/defaults';
import {
  ZItem
} from "@/lib/model/item";
import { postItem } from "@/lib/helper/fetchers";
import type {
  IItem,
} from "@/lib/model/item";
import { ErrorAlert, SuccessAlert, WarnAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import {
  DefaultTagRead,
} from '@/lib/helper/defaults';
import type {
  ITag,
  ITagReadResponse,
} from "@/lib/model/tag";
import { tagGroupOptions } from '@/lib/helper/querying';


type itemFields = "id" | "userId" | "name" | "note" | `props[${number}]` | "softDelete" | `tags[${number}]`

// ToDo: Add the additional properties when a new tag is added to the form.
// ToDo: Change the type of tags from list of string, to list of tag object. and upon submission, retain on the id from the tag object to send to api.

export function AppItemModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const theme: AppTheme = useTheme();
  const tagQuery = {
    ...DefaultTagRead,
    userId: user?.id || "",
    pageSize: -1,
  }
  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useQuery(tagGroupOptions(tagQuery));
  // This call should be done async when the app loads.
  const tags: ITag[] = data && data.tags ? data.tags : [];
  const item: IItem = useBoundStore((state) => state.displayItem);

  // Get names of tags from the tagNames field for existing items or from tags for new items being created from / route via tag or filter category list

  let tagNameSet: Set<string> = new Set();
  if (item.tagNames && item.tagNames.length !== 0) {
    tagNameSet = tagNameSet.union(new Set([...item.tagNames]))
  }
  if (item.tags && item.tags.length !== 0) {
    const passedTags: string[] = item.tags;
    passedTags.forEach(t => {
      const mtch = tags.filter(ts => ts.id == t)
      if (mtch.length > 0) {
        tagNameSet.add(mtch[0].name)
      }
    });
  }
  const tagNames: string[] = [...tagNameSet].sort();


  // Determine list of item props from list of item Tags.
  // Use the combination of the passed Props list and the passed tags.
  let propSet: Set<string> = new Set();

  // Get a set of all the items passed to the  item.propList
  if (item.propList && Object.keys(item.propList).length !== 0) {
    propSet = propSet.union(new Set([...item.propList]))
  }
  // Get the props from all the items passed as tags and add to set of Props
  tagNames.forEach(t => {
    const mtch = tags.filter(ts => ts.name == t)
    if (mtch.length > 0) {
      propSet = propSet.union(new Set([...mtch[0].props]))
    }
  });
  // Convert set to list and sort ascending
  const propList: string[] = [...propSet].sort();

  // Create the key value pair used for the props.
  type IProps = {
    key: string,
    value: string
  }
  let itemProps: IProps[] = [];
  propList.forEach(p => itemProps.push({
    key: p, value: item.props && item.props[p] ? item.props[p] : ""
  }));


  const formData = {
    ...item,
    props: itemProps,
    tags: tagNames.filter((t) => t != "")
  }
  const form = useForm({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IItem }) {
        if (value.name.length < 1) {
          return "Item title is required";
        }
        if (value.tags?.filter((t) => t != "").length < 1) {
          return "A least one tag is required";
        }
        return undefined
      },
      onBlur({ value }: { value: IItem }) {
        if (value.name.length < 1) {
          return "Item title is required";
        }
        if (value.tags?.filter((t) => t != "").length < 1) {
          return "A least one tag is required";
        }
        return undefined
      },
    },
  });



  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IItem) => {
      const mi = ZItem.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item"] }),
        queryClient.invalidateQueries({ queryKey: ["tag"] }),
        queryClient.invalidateQueries({ queryKey: ["filter"] }),
      ])
    },
    onError: (error) => {
      // ToDo: Add error message
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;

    const timer = setTimeout(
      () => {
        if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
          console.log("Timer fired after 2 seconds");
        }
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted, mutation.isSuccess]);


  if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
    console.log("formData", formData);
  }

  function closeModal() {
    store.setItemModal(false);
    store.setDisplayItem(DefaultItem);
  }

  function onFormSubmit(e: ChangeEvent) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: IItem }) {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    const itemId = value.id && value.id != "" ? value.id : uuidv4();
    const userId = user && user.id ? user.id : value.userId;
    const subProps = value.props.reduce((acc: any, i: IProps) => {
      acc[i.key] = i.value;
      return acc
    }, {})
    const submitValue = {
      id: itemId,
      userId,
      name: value.name,
      note: value.note,
      tags: undefined,
      props: subProps,
      tagNames: value.tags?.filter((t) => t != ""),
      propList: undefined,
      softDelete: value.softDelete,
    }
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - submitValue ", submitValue);
    }
    mutation.mutate(submitValue);

  }

  function getSimpleField(key: itemFields) {
    const sx = (key == "id" || key == "userId") ? { display: 'none' } : {}
    return (
      <form.Field
        key={`item-${key}`}
        name={key}
        children={
          (field) =>
            <Grid container sx={{ width: '100%' }} spacing={0}>
              <Grid size={12}>
                <TextField
                  sx={sx}
                  slotProps={{
                    input: { style: { fontSize: "15px" } },
                    inputLabel: { style: { fontSize: "15px" } },
                  }}
                  fullWidth
                  multiline
                  id={`item-${key}`}
                  key={`item-${key}`}
                  value={field.state.value}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  onChange={
                    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                  size="small"
                  variant="standard"
                  margin="dense"
                />
              </Grid>
            </Grid>
        }
      />
    );
  }

  function getPropField() {
    return (
      <form.Field name="props" mode="array">
        {
          (field) => (
            <Fragment >
              {
                field.state.value &&
                field.state.value.map((_, i) => {
                  return <form.Field key={i} name={`props[${i}]`}>{
                    (subField) => {
                      return (
                        <TextField
                          slotProps={{
                            input: { style: { fontSize: "15px" } },
                            inputLabel: { style: { fontSize: "15px" } },
                          }}
                          multiline
                          id={"item-prop-key-" + i}
                          value={subField.state.value.value}
                          label={subField.state.value.key.charAt(0).toUpperCase() + subField.state.value.key.slice(1)}
                          onChange={
                            (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                              subField.handleChange({ ...subField.state.value, value: e.target.value })
                          }
                          size="small"
                          variant="standard"
                          // variant="outlined"
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

  function getTagField() {
    // ToDo: Use Virtualised list for this.
    return (
      <form.Field name="tags" mode="array">
        {
          (field) => (
            <Fragment>
              <Box
                component="fieldset"
                sx={{
                  '& legend': { fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' },
                  border: `0.5px solid`,
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  margin: 0, borderRadius: 1,
                  fontSize: '15px',
                  padding: '16.5px 14px', // Matches standard TextField padding
                  transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    // Standard MUI hover border color
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&:focus-within': {
                    // Matches the "active" blue focus state
                    border: '2px solid',
                    borderColor: 'primary.main',
                    // Adjust padding to prevent "jumping" when border thickness changes
                    padding: '15.5px 13px',
                  },
                }}>
                <legend style={{ padding: '0 0.5rem' }}>Tags</legend>
                <Button disableElevation sx={{ display: 'flex', justifyContent: "flex-start", alignContent: "center", }}
                  onClick={() => field.pushValue('')}
                  type="button">
                  <AppSubtitle1Typography sx={{ textTransform: "none", justifyContent: "center", alignContent: "center", fontSize: '15px', }}>
                    Click to add new tag
                  </AppSubtitle1Typography>
                </Button>
                {
                  field.state.value &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value.map((_, i) => {
                      return <form.Field key={i} name={`tags[${i}]`}>{
                        (subField) => {
                          return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                              <Autocomplete
                                slotProps={{ listbox: { sx: { fontSize: '14px' } } }}
                                size="small"
                                id={"item-tag-" + i}
                                // freeSolo
                                autoHighlight
                                options={tags.map((opt) => opt.name)}
                                value={subField.state.value}
                                inputValue={subField.state.value}
                                onChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string | null) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handles ONLY changes from the provided options.
                                    const sval = newValue ? newValue : "";
                                    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                                      console.log("OnChange", newValue, sval);
                                    }
                                    if (field.state.value.length > 1 && sval == "") {
                                      field.removeValue(i);
                                    } else {
                                      subField.handleChange(sval);
                                    }
                                    // subField.handleChange(sval);
                                  }
                                }
                                onInputChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handles both handwritten and provided option value changes.
                                    const sval = newValue ? newValue : "";
                                    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                                      console.log("OnInputChange", newValue, sval);
                                      console.log("OnInputChange: field.state.value.length", field.state.value.length);
                                    }
                                    if (field.state.value.length > 1 && sval == "") {
                                      field.removeValue(i);
                                    } else {
                                      subField.handleChange(sval);
                                    }
                                    // subField.handleChange(sval);
                                  }
                                }
                                renderInput={
                                  (params) =>
                                    <TextField
                                      // slotProps causes autocorrect to stop working
                                      sx={{
                                        '& .MuiInputBase-input': { fontSize: '14px' }, // Changes the typed text size
                                        '& .MuiInputLabel-root': { fontSize: '14px' }, // Changes the label size
                                      }}
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
                    })
                  }</Grid>
                }
              </Box>
              {/* {!field.state.meta.isValid && (
                <ErrorAlert message={field.state.meta.errors.join(', ')} />
              )} */}
            </Fragment>
          )
        }
      </form.Field>
    );
  }

  function getTagFieldFreeSolo() {
    // ToDo: Use Virtualised list for this.
    return (
      <form.Field name="tags" mode="array">
        {
          (field) => (
            <Fragment>
              <Box
                component="fieldset"
                sx={{
                  '& legend': { fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' },
                  border: `0.5px solid`,
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  margin: 0, borderRadius: 1,
                  fontSize: '15px',
                  padding: '16.5px 14px', // Matches standard TextField padding
                  transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    // Standard MUI hover border color
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&:focus-within': {
                    // Matches the "active" blue focus state
                    border: '2px solid',
                    borderColor: 'primary.main',
                    // Adjust padding to prevent "jumping" when border thickness changes
                    padding: '15.5px 13px',
                  },
                }}>
                <legend style={{ padding: '0 0.5rem' }}>Tags</legend>
                <Button disableElevation sx={{ display: 'flex', justifyContent: "flex-start", alignContent: "center", }}
                  onClick={() => field.pushValue('')}
                  type="button">
                  <AppSubtitle1Typography sx={{ textTransform: "none", justifyContent: "center", alignContent: "center", fontSize: '15px', }}>
                    Click to add new tag
                  </AppSubtitle1Typography>
                </Button>
                {
                  field.state.value &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value.map((_, i) => {
                      return <form.Field key={i} name={`tags[${i}]`}>{
                        (subField) => {
                          return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                              <Autocomplete
                                slotProps={{ listbox: { sx: { fontSize: '14px' } } }}
                                size="small"
                                id={"item-tag-" + i}
                                freeSolo
                                options={tags.map((opt) => opt.name)}
                                // options={tags}
                                // getOptionKey={(opt) => opt.name}
                                value={subField.state.value}
                                inputValue={subField.state.value}
                                onChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string | null) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handles ONLY changes from the provided options.
                                    const sval = newValue ? newValue : "";
                                    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                                      console.log("OnChange", newValue, sval);
                                    }
                                    if (field.state.value.length > 1 && sval == "") {
                                      field.removeValue(i);
                                    } else {
                                      subField.handleChange(sval);
                                    }
                                    // subField.handleChange(sval);
                                  }
                                }
                                onInputChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handles both handwritten and provided option value changes.
                                    const sval = newValue ? newValue : "";
                                    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                                      console.log("OnInputChange", newValue, sval);
                                      console.log("OnInputChange: field.state.value.length", field.state.value.length);
                                    }
                                    if (field.state.value.length > 1 && sval == "") {
                                      field.removeValue(i);
                                    } else {
                                      subField.handleChange(sval);
                                    }
                                    // subField.handleChange(sval);
                                  }
                                }
                                renderInput={
                                  (params) =>
                                    <TextField
                                      // slotProps causes autocorrect to stop working
                                      sx={{
                                        '& .MuiInputBase-input': { fontSize: '14px' }, // Changes the typed text size
                                        '& .MuiInputLabel-root': { fontSize: '14px' }, // Changes the label size
                                      }}
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
                    })
                  }</Grid>
                }
              </Box>
              {/* {!field.state.meta.isValid && (
                <ErrorAlert message={field.state.meta.errors.join(', ')} />
              )} */}
            </Fragment>
          )
        }
      </form.Field>
    );
  }


  function handleDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  // function handleClone() {
  //   const title = form.state.values.name || "";
  //   form.setFieldValue('id', uuidv4());
  //   form.setFieldValue('name', "[Clone of] - " + title);
  // }

  const fields: itemFields[] = ['id', 'userId', 'name', "note"];
  const dialogSx = {
    display: 'block',
    width: "lg",
    maxWidth: "lg",
    height: '65vh',
    // padding: "1",
    // maxHeight: 720,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '15px', // width of the entire scrollbar
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.paper, // color of the tracking area
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.background.default, // color of the scroll thumb
      borderRadius: '10px', // roundness of the scroll thumb
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.background.default,
    },
  }





  const deleteIcon = form.state.isSubmitting ? "ic:baseline-auto-delete" : (!form.state.canSubmit || form.state.values.id == "") ? "mdi:delete-off" : "ic:sharp-delete";
  const deleteTooltip = (!form.state.canSubmit || form.state.values.id == "") ? "Unable to delete" : "Delete";

  const saveIcon = form.state.isSubmitting ? "material-symbols:hourglass-top" : form.state.canSubmit ? "material-symbols:save-sharp" : "lucide:save-off";
  const saveTooltip = !form.state.canSubmit ? "Unable to save" : "Save";
  // const cloneIcon = form.state.values.id == "" ? "tabler:copy-off" : "material-symbols:content-copy-sharp";
  // const cloneTooltip = form.state.values.id == "" ? "Unable to clone" : "Clone";


  const formActions = [
    // { name: cloneTooltip, icon: cloneIcon, onClick: handleClone },
    { name: deleteTooltip, icon: deleteIcon, onClick: handleDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: "Reset", icon: "material-symbols-light:restart-alt", onClick: form.reset },
  ]
  const formErrorMap = useStore(form.store, (state) => state.errorMap)


  function Dlg(content: ReactNode, actions?: ReactNode): ReactNode {
    return (
      <Dialog fullWidth open={store.itemModal} onClose={closeModal} >
        <IconButton aria-label="delete"
          sx={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          }}
          onClick={closeModal}>
          <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
        </IconButton>
        <form onSubmit={onFormSubmit}>
          <DialogContent sx={dialogSx} >
            {content}
          </DialogContent>
          {actions &&
            <DialogActions>
              {actions}
            </DialogActions>}
        </form>
      </Dialog>
    )
  }


  if (isPending) {
    const con = <LinearProgress />;
    return Dlg(con);
  }


  if (isError) {
    const con = <ErrorAlert message={error?.message || "An error occurred. Please try again"} />;
    return Dlg(con);
  }

  const con = (
    <Box
      component="section"
      sx={{
        // marginTop: { xs: '0rem', sm: '1rem', md: '1rem' },
        marginTop: 0,
        marginRight: "5rem",
        fontSize: '15px',
        // padding: { xs: '0rem', sm: '1rem', md: '1rem' },
        padding: 0,
      }}>
      <Stack spacing={0} sx={{ width: '100%' }} >
        {mutation.error && (
          <Fragment>
            <ErrorAlert message={mutation.error.message} />
            <h5 onClick={() => mutation.reset()}>{mutation.error.message}</h5>
          </Fragment>
        )}
        {mutation.isSuccess && (
          <Fragment>
            <SuccessAlert message="Item updated!" />
          </Fragment>
        )}
        {
          formErrorMap.onChange && (<WarnAlert message={`${formErrorMap.onChange}`} />)
        }
        {
          formErrorMap.onBlur && (<ErrorAlert message={`${formErrorMap.onBlur}`} />)
        }
        {fields.map((fds: itemFields) => getSimpleField(fds))}

        {/* ToDo: fix display for tags and fields. */}
        {getPropField()}
        {getTagField()}
      </Stack>
    </Box>
  )

  const act = (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting, state.values.name]}
      children={() => (
        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {formActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<Icon icon={action.icon} width="36" height="36" />}
                // @ts-ignore
                onClick={action.onClick}
                slotProps={{
                  tooltip: {
                    title: action.name,
                  },
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      )}
    />
  )
  return Dlg(con, act);
}
