
import {
  Fragment,
  useEffect,
  useRef,
  useState,
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
import { useTheme } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import RestartIcon from '@iconify-react/mdi/restart';
import RestartOffIcon from '@iconify-react/mdi/restart-off';
import SaveIcon from '@iconify-react/material-symbols/save';
import SaveOffIcon from '@iconify-react/lucide/save-off';
import DeleteIcon from '@iconify-react/mdi/delete';
import DeleteOffIcon from '@iconify-react/mdi/delete-off';
import HourglassOutlineIcon from '@iconify-react/material-symbols/hourglass-outline';



// Internal imports
import {
  AppSubtitle1Typography,
  AppDialogListItemSecondaryTypography,
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
  IFormItem,
  IFormProps,
} from "@/lib/model/item";
import {
  ErrorAlert,
  SuccessAlert,
  WarnAlert
} from "@/components/core/Alerts";
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
  tagGroupOptions,
} from '@/lib/helper/querying';
import {
  SpaceBetweenBox,
} from "@/components/core/AppBox";
import {
  AppDefaultButton,
  AppDangerButton,
  AppWarnButton,
  AppMutedButton,
} from "@/components/core/AppButton";


type itemFields = "id" | "userId" | "name" | "note" | `props[${number}]` | "softDelete" | `tags[${number}]`



export function AppItemModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const theme: AppTheme = useTheme();
  const [tagToDelete, setTagToDelete] = useState<ITag | null>(null);
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
  const formData = {
    id: item.id, userId: item.userId, name: item.name,
    note: item.note, props: item.propObjs,
    tags: item.tagObjs, softDelete: item.softDelete
  };
  // @ts-ignore
  const form = useForm<IFormItem>({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IFormItem }) {
        const invalidName = nameValidation(value.name);
        if (invalidName) {
          return invalidName;
        }
        const invalidTag = tagsValidation(value.tags as unknown as ITag[]);
        if (invalidTag) {
          const msg = formErrorMap.onChange ? "\n" + invalidTag : invalidTag;
          return msg;
        }
        return undefined
      },
      onBlur({ value }: { value: IFormItem }) {
        const invalidName = nameValidation(value.name);
        if (invalidName) {
          return invalidName;
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
  const formErrorMap = useStore(form.store, (state) => state.errorMap);

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
      }, 5000);
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

  function formSubmission({ value }: { value: IFormItem }) {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    const itemId = value.id && value.id != "" ? value.id : uuidv4();
    const userId = user && user.id ? user.id : value.userId;
    const subProps = value.props.reduce((acc: any, i: IFormProps) => {
      acc[i.key] = i.value;
      return acc
    }, {})
    // @ts-ignore
    const tgs = value.tags?.filter(t => t.name != "").map(t => t.id);


    const submitValue = {
      id: itemId,
      userId,
      name: value.name,
      note: value.note,
      tags: tgs,
      props: subProps,
      tagObjs: undefined,
      propObjList: undefined,
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
        validators={{
          onChange: ({ value }) => {
            if (key == "name") {
              return nameValidation(value as unknown as string)
            }
          },
          onBlur: ({ value }) => {
            if (key == "name") {
              return nameValidation(value as unknown as string)
            }
          },
        }}
        children={
          (field) => {
            return <Grid container sx={{ width: '100%' }} spacing={0}>
              <Grid size={12}>
                <TextField
                  sx={sx}
                  slotProps={{
                    input: { style: { fontSize: "1rem" } },
                    inputLabel: { style: { fontSize: "1rem" } },
                  }}
                  fullWidth
                  multiline
                  id={`item-${key}`}
                  key={`item-${key}`}
                  value={field.state.value}
                  label={key}
                  onChange={
                    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                  size="small"
                  variant="standard"
                  margin="dense"
                  error={key == "name" && field.state.meta.errors.length > 0}
                  helperText={field.state.meta.errors.join(', ')}
                />
              </Grid>
            </Grid>
          }
        }
      />
    );
  }

  const tboxSx = {
    '& legend': { fontSize: '1rem', color: 'rgba(0, 0, 0, 0.6)' },
    border: `0.5px solid`,
    borderColor: "rgba(0, 0, 0, 0.23)",
    margin: 0, borderRadius: 1,
    fontSize: '1rem',
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
  function getTagField() {
    // ToDo: Use Virtualised list for this.
    // Maybe ToDo: Use an alert to confirm the props that would be deleted when a tag is removed before a tag is removed.
    // ToDo: Change the font color of the tag that corresponds to a property that is in focus.

    return (
      <form.Field name="tags" mode="array" key="tag-parent">
        {
          (field) => {
            return <Fragment>
              <Box key="tags" component="fieldset" sx={tboxSx}>
                <legend style={{ padding: '0 0.5rem' }}>tags</legend>
                <Button disableElevation sx={{ display: 'flex', justifyContent: "flex-start", alignContent: "center", }}
                  onClick={() => field.pushValue(DefaultTag)}
                  type="button">
                  <AppSubtitle1Typography sx={{ textTransform: "none", justifyContent: "center", alignContent: "center", fontSize: '1rem', }}>
                    Click to add new tag
                  </AppSubtitle1Typography>
                </Button>
                {
                  field.state.value && field.state.value.length > 0 &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value && field.state.value.map((_, i) => {
                      return (
                        <form.Field
                          key={i} name={`tags[${i}]`}
                          validators={{
                            onChange: ({ value }) => tagValidation(value as unknown as ITag),
                            onBlur: ({ value }) => tagValidation(value as unknown as ITag),
                          }}
                        >{
                            (subField: any) => {
                              const textSx = {
                                '& .MuiInputBase-input': {
                                  fontSize: '1rem',
                                }, // Changes the typed text size
                                '& .MuiInputLabel-root': { fontSize: '1rem' }, // Changes the label size
                              }

                              return (
                                <Grid
                                  key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                                  size={{ xs: 12, sm: 6, lg: 4 }}>
                                  <Autocomplete
                                    slotProps={{
                                      listbox: {
                                        sx: { fontSize: '14px', }
                                      },
                                    }}
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

  function getPropField() {
    return (
      <form.Field name="props" mode="array">
        {
          (field) => (
            <Fragment >
              {
                field.state.value &&
                field.state.value.map((_, i) => {
                  return <form.Field key={"item-prop-key-" + i} name={`props[${i}]`}>{
                    (subField) => {
                      return (
                        <TextField
                          slotProps={{
                            input: { style: { fontSize: "1rem" }, },
                            inputLabel: { style: { fontSize: "1rem" } },
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
    let newProps: IFormProps[] = [];
    prpList.filter(i => i !== "").forEach((npl: string) => {
      const anpl = oldProps.filter((i: IFormProps) => i.key == npl)
      if (anpl.length == 0) {
        newProps = [...newProps, { key: npl, value: "" }]
      } else {
        newProps = [...newProps, { key: npl, value: anpl[0].value }]
      }
    })
    newProps = newProps.sort((a: IFormProps, b: IFormProps) => b.value.localeCompare(a.value))
    form.setFieldValue('props', newProps)
  }

  function handleTagsChange(parentF: any, childF: any, newValue: string | null) {
    const sval = newValue ? newValue : "";
    if (sval == "") {
      // If the value was deleted, replace the tag object with the default tag object.
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

  function handleTagDeletePostConfirm(uInput: boolean) {
    // if (yesDelete) {
    if (uInput) {
      const par = tagToDelete?.p;
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

  function tagsValidation(fTagList: ITag[]) {
    let errs = "";
    let newMsg = "";
    if (fTagList.filter((t) => t.name != "").length < 1) {
      errs += "Item must contain one tag at least ";
    }
    // const unrecognisedTags = fTagList.filter((t) => !knownTagNames.current.has(t.name));
    const unrecognisedTags = fTagList.filter((t) => t.name != "").filter((t) => !knownTagNames.current.has(t.name));
    if (unrecognisedTags.length > 0) {
      const unregognisedNames = unrecognisedTags.map(it => it.name).join(',')
      newMsg = `Unrecognised tag(s): (${unregognisedNames}) will not be saved.`;
      errs += errs == "" ? newMsg : "\n" + newMsg;
    }
    // console.info('In tags validation - errs', errs)
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

  function nameValidation(fieldName: string) {
    if (!fieldName || fieldName.length < 1) {
      return "Item name is required";
    }
  }

  function handleItemDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const fields: itemFields[] = ['id', 'userId', 'name', "note"];

  function TagDeleteDialog() {
    return (
      < Dialog open={tagToDelete !== null} disableScrollLock >
        <DialogTitle
          id="save-dialog-title"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            p: 3, paddingBottom: 0,
          }}
        >{tagToDelete?.c?.state.value.name ?? ""}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <AppSubtitle1Typography>
            Deleting this will remove the following item properties:
          </AppSubtitle1Typography>

          <List sx={{ p: -1, m: -1 }}>
            {tagToDelete?.c?.state.value.props.map((tp) =>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={
                      <AppDialogListItemSecondaryTypography
                        sx={{ py: -1, my: -1 }}>{tp}</AppDialogListItemSecondaryTypography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>

        </DialogContent>
        <Divider />
        <DialogActions>
          <Stack direction="row" spacing={4}>
            <AppDefaultButton label="Cancel" handleClick={() => handleTagDeletePostConfirm(false)} />
            <AppDangerButton label="Delete" handleClick={() => handleTagDeletePostConfirm(true)} />
          </Stack>

        </DialogActions>
      </Dialog >
    );
  }

  const dialogSx = {
    display: 'block',
    width: "sm",
    maxWidth: "sm",
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

  function Dlg(content: ReactNode, actions?: ReactNode): ReactNode {
    return (
      <Dialog fullWidth maxWidth="sm" open={store.itemModal} onClose={closeModal} >
        <SpaceBetweenBox >
          <DialogTitle
            id="save-dialog-title"
            sx={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between",
              pb: 0, pt: 2, px: 3,
            }}
          >{item.id == "" ? "Add new item" : "Update Item"}
          </DialogTitle>

          <IconButton aria-label="close dialog"
            sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}
            size="small"
            onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </IconButton>
        </SpaceBetweenBox>
        <Divider />
        {mutation.isSuccess && <SuccessAlert message="Item updated!" />}
        {formErrorMap.onChange && <WarnAlert message={`${formErrorMap.onChange}`} />}
        <Divider />
        <TagDeleteDialog />

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
    );
  }

  if (isPending) { return Dlg(<LinearProgress />); }
  if (isError) { return Dlg(<ErrorAlert message={error?.message || "An error occurred. Please try again"} />); }

  const con = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        {mutation.error && (
          <Fragment>
            <ErrorAlert message={mutation.error.message} />
            <h5 onClick={() => mutation.reset()}>{mutation.error.message}</h5>
          </Fragment>
        )}
        {fields.map((fds: itemFields) => getSimpleField(fds))}
        {getPropField()}
        {getTagField()}
      </Stack>
    </Box>
  );


  const deleteTooltip = (
    form.state.values.id == "" ? "new item can't be deleted" :
      form.state.isSubmitting ? "item is being saved" : "delete item"
  );
  const saveTooltip = (
    form.state.isPristine ? "no changes to save" :
      form.state.isSubmitting ? "item is being saved" :
        !form.state.canSubmit ? "changes contain errors" : "save changes"
  );
  const resetTooltip = form.state.isDirty ? "reset" : "no changes to reset";
  const deleteIcon = (
    form.state.isSubmitting || form.state.values.id == "" ? <DeleteOffIcon height="1.5rem" /> :
      <DeleteIcon height="1.5rem" />
  );
  const saveIcon = form.state.isSubmitting ? <HourglassOutlineIcon height="1.5rem" /> :
    (!form.state.isPristine && form.state.canSubmit) ? <SaveIcon height="1.5rem" /> :
      <SaveOffIcon height="1.5rem" />;
  const resetIcon = form.state.isDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />;


  const formActions = [
    { name: deleteTooltip, icon: deleteIcon, onClick: handleItemDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: resetTooltip, icon: resetIcon, onClick: form.reset },
  ];

  const act = (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting, state.values.name]}
      children={() => (
        <Box sx={{ height: '5vh', transform: 'translateZ(0px)', flexGrow: 1 }}>

          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
              position: 'absolute', bottom: 0, right: 0,
              '& .MuiFab-primary': { width: 50, height: 50, minHeight: 50, }
            }}
            icon={<SpeedDialIcon />}
          >
            {formActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
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
  );

  return Dlg(con, act);
}
