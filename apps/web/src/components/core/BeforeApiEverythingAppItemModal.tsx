
import {
  Fragment,
  useEffect,
  useRef,
  useMemo,
  memo,
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
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import { Divider, LinearProgress, useTheme } from "@mui/material";
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
import {
  tagGroupOptions
} from '@/lib/helper/querying';
import {
  SpaceBetweenBox,
} from "@/components/core/AppBox";
import {
  AppDefaultButton
} from "@/components/core/AppButton";


type itemFields = "id" | "userId" | "name" | "note" | `props[${number}]` | "softDelete" | `tags[${number}]`



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
  const tags: ITag[] = data && data.tags ? data.tags : [];
  const item: IItem = useBoundStore((state) => state.displayItem);
  const knownTagNames = useRef<Set<string>>(new Set(tags.map(p => p.name)));
  const focusTags = useRef<Set<string>>(new Set<string>([]));
  const allTagProps = useRef<Map<string, Set<string>>>(new Map<string, Set<string>>());
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>();



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

  // const propTags = new Map<string, Set<string>>();
  if (Object.keys(allTagProps.current).length == 0) {
    // ToDo: Read this from the API
    propList.forEach((it: string) => {
      const tL = tObj.filter(
        (iit: ITag) => iit.props.indexOf(it) != -1
      ).map(
        (ibt: ITag) => ibt.name
      );
      allTagProps.current.set(it, new Set(tL))
    });
    console.info('allTagProps', allTagProps)
  }



  // Create the key value pair used for the props.
  type IProps = { key: string, value: string, }
  let itemProps: IProps[] = [];
  propList.forEach(p => itemProps.push({
    key: p, value: item.props && item.props[p] ? item.props[p] : "",
  }));


  type formType = Omit<IItem, 'tags' | 'props'> & { props: IProps[], tags: ITag[] }
  const formData = { ...item, props: itemProps, tags: tObj } as formType;
  // @ts-ignore
  const form = useForm<formType>({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IItem }) {
        if (value.name.length < 1) {
          return "Item title is required";
        }
        const invalidTag = tagsValidation(value.tags as unknown as ITag[]);
        if (invalidTag) {
          const msg = formErrorMap.onChange ? "\n" + invalidTag : invalidTag;
          return msg;
        }
        return undefined
      },
      onBlur({ value }: { value: IItem }) {
        if (value.name.length < 1) {
          return "Item title is required";
        }
        const invalidTag = tagsValidation(value.tags as unknown as ITag[]);
        if (invalidTag) {
          const msg = formErrorMap.onBlur ? "\n" + invalidTag : invalidTag;
          return msg;
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


  console.info('formData', formData)

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
    // @ts-ignore
    let tgs = value.tags?.filter(t => t.name != "");
    // @ts-ignore
    tgs = tgs.map(t => t.id);


    const submitValue = {
      id: itemId,
      userId,
      name: value.name,
      note: value.note,
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
                          onFocus={
                            () => {
                              clearTimeout(blurTimeout.current);
                              focusTags.current = allTagProps.current.get(subField.state.value.key) ?? new Set();
                            }
                          }
                          onBlur={() => {
                            // focusTags.current = new Set();
                            blurTimeout.current = setTimeout(() => focusTags.current = new Set(), 0)

                          }}
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
    form.setFieldValue('props', newProps)
  }

  function handleTagsChange(parentF: any, childF: any, newValue: string | null) {
    const sval = newValue ? newValue : "";
    const fField = parentF?.state?.value as unknown as ITag[] ?? [];
    if (sval == "") {
      // If the value was deleted, replace the tag object with the default tag object.
      const newTagList = fField.filter(fsv => fsv.id != childF.state.value.id);
      addNewTagProps({ value: newTagList });
      if (newTagList.filter(itt => itt.name !== "").length >= 1) {
        const removeIdx = parentF.state.value.map((iF: ITag) => iF.id).indexOf(childF.state.value.id);
        if (removeIdx > -1) {
          parentF.removeValue(removeIdx);
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
    // Maybe ToDo: Use an alert to confirm the props that would be deleted when a tag is removed before a tag is removed.
    // ToDo: Change the font color of the tag that corresponds to a property that is in focus.
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
    return (
      <form.Field name="tags" mode="array">
        {
          (field) => {
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
                              // const propsList = useStore(form.store, (state) => state.values.props);
                              // console.info('propsList', propsList);

                              const textSx = {
                                '& .MuiInputBase-input': {
                                  fontSize: '14px',
                                  color: focusTags.current && focusTags.current.has(subField.state.value.name) ? '#a126ca' : '#0eb40b',
                                }, // Changes the typed text size
                                '& .MuiInputLabel-root': { fontSize: '14px' }, // Changes the label size
                                '& .MuiInputBase-root.Mui-focused .MuiInputBase-input': {
                                  color: focusTags.current && focusTags.current.has(subField.state.value.name) ? '#a126ca' : '#0eb40b',
                                },

                              }
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
                                          error={subField.state.meta.errors.length > 0}
                                          helperText={subField.state.meta.errors.join(', ')}
                                          // slotProps causes autocorrect to stop working
                                          sx={textSx}
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
              </Box>
            </Fragment>
          }
        }
      </form.Field >
    );
  }

  function tagsValidation(fTagList: ITag[]) {
    let errs = "";
    let newMsg = "";
    if (fTagList.filter((t) => t.name != "").length < 1) {
      errs += "A least one tag is required";
    }
    // const unrecognisedTags = fTagList.filter((t) => !knownTagNames.current.has(t.name));
    const unrecognisedTags = fTagList.filter((t) => t.name != "").filter((t) => !knownTagNames.current.has(t.name));
    if (unrecognisedTags.length > 0) {
      const unregognisedNames = unrecognisedTags.map(it => it.name).join(',')
      newMsg = `Unrecognised tag(s): (${unregognisedNames}) will not be saved.`;
      errs += errs == "" ? newMsg : "\n" + newMsg;
    }
    if (errs !== "") {
      return errs
    }
  }

  function tagValidation(fTag: ITag) {
    let errList: string[] = [];
    if (fTag.name === "") {
      errList = [...errList, "Tag name is required"]
    }
    if (!knownTagNames.current.has(fTag.name) && fTag.name != "") {
      errList = [...errList, `Unrecognised tag (${fTag.name}) will not be saved. Please add new tag to app.`]
    }
    if (errList.length > 0) {
      return errList.join("\n")
    }
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
    height: 'fit-content',
    maxHeight: '70vh',
    overflow: 'auto',
    margin: "0",
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


  const formActions = [
    { name: deleteTooltip, icon: deleteIcon, onClick: handleDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: "Reset", icon: "material-symbols-light:restart-alt", onClick: form.reset },
  ]
  const formErrorMap = useStore(form.store, (state) => state.errorMap);


  function Dlg(content: ReactNode, actions?: ReactNode): ReactNode {
    return (
      <Dialog fullWidth maxWidth="xl" open={store.itemModal} onClose={closeModal} >
        <SpaceBetweenBox >
          <DialogTitle
            id="save-dialog-title"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              pb: 0,
              pt: 2,
              px: 3,
            }}
          >{item.id == "" ? "Add new item" : "Update Item"}</DialogTitle>
          <IconButton aria-label="close dialog"
            sx={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            }}
            size="small"
            onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </IconButton>
        </SpaceBetweenBox>

        <form onSubmit={onFormSubmit}>
          <DialogContent sx={dialogSx} >
            {content}
          </DialogContent>
          <Divider />
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


  const GetProps = memo(() => getPropField());
  const GetTags = memo(() => getTagField());


  const con = (
    <Box
      component="section"
      sx={{
        margin: 0,
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
        {/* {getPropField()}
        {getTagField()} */}
        <GetProps />
        <GetTags />
      </Stack>
    </Box>
  )

  const act = (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting, state.values.name]}
      children={() => (
        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
          <Stack direction="row" spacing={4}>
            <AppDefaultButton label="Save" handleClick={form.handleSubmit} />
            {/* @ts-ignore */}
            <AppDefaultButton label="Reset" handleClick={form.reset} />
            <AppDefaultButton label="Delete" handleClick={handleDelete} />
          </Stack>

          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
              position: 'absolute', bottom: 0, right: 0,
              '& .MuiFab-primary': {
                width: 36,
                height: 36,
                minHeight: 36,
              }
            }}
            icon={<SpeedDialIcon />}
          >
            {formActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<Icon icon={action.icon} width="24" height="24" />}
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
      )
      }
    />
  )

  return Dlg(con, act);
}
