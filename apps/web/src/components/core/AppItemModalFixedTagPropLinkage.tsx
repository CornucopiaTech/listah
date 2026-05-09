
import {
  Fragment,
  useEffect,
  useRef,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import {
  getRouteApi,
} from '@tanstack/react-router';
import {
  useForm,
  useStore,
  type FieldListenerFn,
  type FieldApi,
} from "@tanstack/react-form";
import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type {
  UseSuspenseQueryResult,
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
  DefaultTag,
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
  const routeApi = getRouteApi('/items/');
  const { search } = routeApi.useRouteContext();
  const { query } = search;

  const tagQuery = {
    ...DefaultTagRead,
    userId: query.userId,
    pagination: { ...DefaultTagRead.pagination, pageSize: -1 }
  }
  const {
    isPending, isError, data, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useSuspenseQuery(tagGroupOptions(tagQuery));
  // This call should be done async when the app loads.
  const tags: ITag[] = data && data.tags ? data.tags : [];
  const item: IItem = useBoundStore((state) => state.displayItem);
  const knownTagNames = useRef<Set<string>>(new Set(tags.map(p => p.name)))

  // Get object of tags and the properties associated with those tags.
  let tagObj: string[] = item.tags?.filter(
    t => t != ""
  ) || [];
  let tObj: ITag[] = [];
  tagObj.forEach(t0 => {
    const it = tags.filter(ts => ts.id == t0);
    if (it.length >= 1) {
      tObj = [...tObj, it[0]]
    }
  });



  const tagProps: string[] = tObj.reduce((acc: string[], prp) => {
    return [...acc, ...prp.props]
  }, [])
  const propList: string[] = [...new Set(tagProps)].sort();


  // Create the key value pair used for the props.
  type IProps = { key: string, value: string }
  let itemProps: IProps[] = [];
  propList.forEach(p => itemProps.push({
    key: p, value: item.props && item.props[p] ? item.props[p] : ""
  }));


  const formData = { ...item, props: itemProps, tags: tObj }
  const form = useForm({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IItem }) {
        if (value.name.length < 1) {
          return "Item title is required";
        }
        tagValidation(value.tags as unknown as ITag[]);
        return undefined
      },
      onBlur({ value }: { value: IItem }) {
        if (value.name.length < 1) {
          return "Item title is required";
        }
        tagValidation(value.tags as unknown as ITag[]);
        return undefined
      },
    },
  });
  // if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  //   console.log("formData", formData);
  // }


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
    let tgs = value.tags?.filter(t => t.name != "");
    tgs = tgs.map(t => t.id);


    const submitValue = {
      id: itemId,
      userId,
      name: value.name,
      note: value.note,
      // tags: value.tags?.filter((t) => t != ""),
      tags: tgs,
      props: subProps,
      tagNames: undefined,
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
      <form.Subscribe selector={(state) => state.values.tags}>{
        (tagsValue) => <form.Field name="props" mode="array">
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
                            label={subField.state.value.key}
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
      }</form.Subscribe>

    );
  }

  function addNewTagProps({ value }: any) {
    const oldProps = form.getFieldValue('props');
    const pL = (value as ITag[]).reduce((acc: string[], ev: ITag) => {
      const epL = ev.props || []
      return [...acc, ...epL]
    }, []);
    const prpList = [...new Set(pL)].sort()
    let newProps: IProps[] = [];
    prpList.filter(i => i !== "").forEach((npl: string) => {
      const anpl = oldProps.filter((i: IProps) => i.key == npl)
      if (anpl.length == 0) {
        newProps = [...newProps, { key: npl, value: "" }]
      } else {
        newProps = [...newProps, { key: npl, value: anpl[0].value }]
      }
    })
    newProps = newProps.sort((a: IProps, b: IProps) => b.value.localeCompare(a.value))
    // console.log(`resetting propList - tag changed to:`, value, newProps);
    form.setFieldValue('props', newProps)
  }

  function handleTagsChange(parentF: any, childF: any, newValue: string | null) {
    console.log(`Tag changed to - parent, child, newValue, index`, parentF.state.value, childF.state.value, newValue, i);
    const sval = newValue ? newValue : "";
    const fField = parentF?.state?.value as unknown as ITag[] ?? [];
    if (sval == "") {
      // If the value was deleted, replace the tag object with the default tag object.
      const newTagList = fField.filter(fsv => fsv.id != childF.state.value.id);
      addNewTagProps({ value: newTagList });
      if (fField.length > 1) {
        const removeIdx = parentF.state.value.map((iF: ITag) => iF.id).indexOf(childF.state.value.id);
        console.log(`Pre removing index pre - parent, newValue, index`, parentF.state.value, childF.state.value, newValue, removeIdx);
        if (removeIdx > -1) {
          parentF.removeValue(removeIdx);
          console.log(`Post removing index pre - parent, newValue, index`, parentF.state.value, childF.state.value, newValue, removeIdx);
        }

      } else {
        childF.handleChange(DefaultTag);
      }
    } else {
      // If a nonzero value is added, then use the information to update the tag object.
      const it = tags.filter(itt => itt.name == sval);
      if (it.length > 0) {
        // If the passed value is a known name of a tag..
        childF.handleChange(it[0]);
        addNewTagProps({ value: [...fField, it[0]] })
      }
      else {
        childF.handleChange({ ...DefaultTag, name: sval });
      }
    }
  }

  function getTagField() {
    // ToDo: Use Virtualised list for this.
    const tboxSx = {
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
    }
    // const addTagSx =
    return (
      <form.Field name="tags" mode="array">
        {
          (field) => {
            const fField = field?.state?.value as unknown as ITag[] ?? [];
            console.log(`At render - parent, length`, fField, fField.length,);
            return <Fragment>
              <Box component="fieldset" sx={tboxSx}>
                <legend style={{ padding: '0 0.5rem' }}>Tags</legend>
                <Button disableElevation sx={{ display: 'flex', justifyContent: "flex-start", alignContent: "center", }}
                  onClick={() => field.pushValue(DefaultTag)}
                  type="button">
                  <AppSubtitle1Typography sx={{ textTransform: "none", justifyContent: "center", alignContent: "center", fontSize: '15px', }}>
                    Click to add new tag
                  </AppSubtitle1Typography>
                </Button>
                {
                  field.state.value && field.state.value.length > 0 &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value && field.state.value.map((_, i) => {
                      return (
                        <form.Field key={i} name={`tags[${i}]`} validators={{
                          onChange: ({ value }) => tagValidation(value as unknown as ITag),
                          onBlur: ({ value }) => tagValidation(value as unknown as ITag),
                        }}>{
                            (subField: any) => {
                              console.info('subField.state.meta.errors', subField.state.meta.errors)
                              return (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Autocomplete
                                    slotProps={{ listbox: { sx: { fontSize: '14px' } } }}
                                    size="small"
                                    id={"item-tag-" + i}
                                    autoHighlight
                                    options={tags.map((opt) => opt.name)}
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
                                          error={subField.state.meta.errors !== null && subField.state.meta.errors !== undefined}
                                          helperText={subField.state.meta.errors.join(', ')}
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
                                  {/* <FieldError field={subField} /> */}
                                </Grid>
                              )
                            }
                          }</form.Field>
                      );
                    })
                  }</Grid>
                }
              </Box>
              {/* {!field.state.meta.isValid && (
                <ErrorAlert message={field.state.meta.errors.join(', ')} />
              )} */}
            </Fragment>
          }
        }
      </form.Field >
    );
  }

  function FieldError({ field }: { field: any }) {
    return field.state.meta.errors.length > 0 ? (
      <span style={{ color: 'red' }}>
        {field.state.meta.errors.join(', ')}
      </span>
    ) : null
  }

  function tagsValidation(fTagList: ITag[]) {
    let errs = ""
    if (fTagList.filter((t) => t.name != "").length < 1) {
      errs += "A least one tag is required";
    }
    const unrecognisedTags = fTagList.filter((t) => !knownTagNames.current.has(t.name));
    if (unrecognisedTags.length > 0) {
      const unregognisedNames = unrecognisedTags.map(it => it.name).join(',')
      errs += `Unrecognised tag(s): (${unregognisedNames} will not be saved.`;
    }
    if (errs !== "") {
      return errs
    }
  }

  function tagValidation(fTag: ITag) {
    let errs = ""
    let errList: string[] = [];
    if (fTag.name === "") {
      errs += "A least one tag is required";
      errList = [...errList, "A least one tag is required"]
    }
    if (!knownTagNames.current.has(fTag.name)) {
      errs += `Unrecognised tag(s): (${fTag.name} will not be saved.`;
      errList = [...errList, `Unrecognised tag(s): (${fTag.name} will not be saved.`]
    }
    if (errList.length > 0) {
      return errList.join("\n")
    }
    // if (errs !== "") {
    //   return errs
    // }
  }


  function handleDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const fields: itemFields[] = ['id', 'userId', 'name', "note"];
  const dialogSx = {
    display: 'block',
    width: "lg",
    maxWidth: "lg",
    height: '65vh',
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
        marginTop: 0,
        marginRight: "5rem",
        fontSize: '15px',
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
