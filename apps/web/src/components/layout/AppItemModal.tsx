
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
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import { useTheme } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



// Internal imports
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
import type { AppTheme } from '@/system/theme';
import {
  DefaultTagRead,
  DefaultTag,
} from '@/lib/helper/defaults';
import type {
  ITag,
  ITagReadResponse,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";
import {
  tagGroupOptions,
} from '@/lib/helper/querying';
import {
  ItemFormTagBox,
  ItemFormSpeedDialBox,
} from "@/components/core/AppBox";
import { AppModalCloseButton } from "@/components/core/AppButton";



type itemFields = "id" | "userId" | "name" | "note" | `props[${number}]` | "softDelete" | `tags[${number}]`


export function AppItemModal({ itemTag, itemFilter }: { itemTag?: ITag, itemFilter?: IFilter }): ReactNode {
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


  const tags: ITag[] = data?.tags ?? [];
  const knownTagNames = useRef<Set<string>>(new Set(tags.map(p => p.name)));
  const item: IItem = useBoundStore((state) => state.displayItem);
  const tagPropMap = new Map<string, { value: string[] }>(Object.entries(data?.tagidPropMap ?? {}));

  // Get the list of all properties from tags in the items list.
  let tagProps: string[] = []
  item.tags.forEach(
    (it) => (tagProps = [...tagProps, ...tagPropMap?.get(it)?.value ?? []])
  );

  // Get the values for the identified properties.
  const tagPropsObj = tagProps.map((tg) => {
    const ap = item?.propObjs?.filter(ip => ip.key == tg) ?? []
    if (ap.length == 0) {
      return { key: tg, value: "" }
    }
    return ap[0]
  })

  // Get the existing or prospective tags.
  let tgs = [...item.tags]
  if (itemTag) {
    tgs = [...tgs, itemTag.id]
  }
  if (itemFilter) {
    tgs = [...tgs, ...itemFilter.tags]
  }
  // @ts-ignore
  const tagObj = [...new Set(tgs || [])].reduce((acc, tg) => {
    const ap = tags?.filter(ip => ip.id == tg) ?? [];
    if (ap.length > 0) {
      return [...acc, ap[0]]
    }
  }, []);


  const formData = {
    id: item.id, userId: item.userId, name: item.name,
    note: item.note, props: tagPropsObj, tags: tagObj,
    softDelete: item.softDelete
  };


  function validateTags(fTagList: ITag[]) {
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
    if (errs !== "") {
      return errs
    }
  }


  function validateTag(fTag: ITag) {
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


  function validateName(fieldName: string) {
    if (!fieldName || fieldName.length < 1) {
      return "Item name is required";
    }
  }


  function formValidator({ value }: { value: IFormItem }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidTag = validateTags(value.tags);
    if (invalidTag) {
      return invalidTag
    }
    return undefined;
  }


  // @ts-ignore
  const form = useForm<IFormItem>({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IFormItem }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: IFormItem }) {
        return formValidator({ value });
      },
    },
  });
  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formErrors = useStore(form.store, (state) => state.errors);
  const formCanSubmit = formErrors.length == 0;
  const formIsSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const formIsDirty = useStore(form.store, (state) => state.isDirty);
  const formStateId = useStore(form.store, (state) => state.values.id);


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
      // tags: tgs,
      tags: [],
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
    return (
      <form.Field
        key={`item-${key}`}
        name={key}
        validators={{
          onChange: ({ value }) => {
            if (key == "name") {
              return validateName(value as unknown as string)
            }
          },
          onBlur: ({ value }) => {
            if (key == "name") {
              return validateName(value as unknown as string)
            }
          },
        }}
        children={
          (field) => {
            return <Grid container sx={{ width: '100%' }} spacing={0}>
              <Grid size={12}>
                <TextField
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
                  error={key == "name" && (field.state.meta.errors.length > 0 || field.state.value == "")}
                  helperText={key == "name" && field.state.meta.errors.length > 0 ? key == "name" && field.state.meta.errors.join(', ') : key == "name" && field.state.value == "" ? "item name is required" : ""}
                />
              </Grid>
            </Grid>
          }
        }
      />
    );
  }

  function getTagField() {
    return (
      <form.Field name="tags" mode="array" key="tag-parent" >
        {
          (field) => {
            return <Fragment>
              {/* @ts-ignore */}
              <ItemFormTagBox key="tags" component="fieldset">
                <legend style={{ padding: '0 0.5rem', color: theme.palette.primary.main, fontSize: "12px" }}>tags</legend>
                <Button variant="text" color="inherit" onClick={() => field.pushValue(DefaultTag)} >
                  Click here to add a new tag
                </Button>
                {
                  field.state.value && field.state.value.length > 0 &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value && field.state.value.map((_, i) => {
                      return (
                        <form.Field
                          key={i} name={`tags[${i}]`}
                          validators={{
                            onChange: ({ value }) => validateTag(value as unknown as ITag),
                            onBlur: ({ value }) => validateTag(value as unknown as ITag),
                          }}
                        >{
                            (subField: any) => {
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

  function handleDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const fields: itemFields[] = ['name', "note"];

  function TagDeleteDialog() {
    return (
      < Dialog open={tagToDelete !== null} disableScrollLock >
        <DialogTitle id="save-dialog-title" >
          {/* @ts-ignore */}
          {tagToDelete?.c?.state.value.name ?? ""}
        </DialogTitle>
        <Divider />
        <DialogContent>
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

        </DialogContent>
        <Divider />
        <DialogActions>
          <Stack direction="row" spacing={4}>
            <Button variant="contained" onClick={() => handleTagDeletePostConfirm(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={() => handleTagDeletePostConfirm(true)}> Delete </Button>
          </Stack>

        </DialogActions>
      </Dialog >
    );
  }

  function Dlg(content: ReactNode, actions?: ReactNode): ReactNode {
    return (
      <Dialog fullWidth maxWidth="sm" open={store.itemModal} onClose={closeModal} >
        <DialogTitle id="save-dialog-title" >
          {item.id == "" ? "Add new item" : "Update Item"}
          <AppModalCloseButton aria-label="close dialog"
            size="small" onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </AppModalCloseButton>
        </DialogTitle>
        <Divider />
        {mutation.isSuccess && <Alert severity="success"> {"Changes saved!"} </Alert>}
        {mutation.error && (
          <Fragment>
            <Alert severity="error"> {mutation.error.message}</Alert>
            <h5 onClick={() => mutation.reset()}>{mutation.error.message}</h5>
          </Fragment>
        )}
        {formErrorMap.onChange && <Alert severity="warning"> {`${formErrorMap.onChange}`} </Alert>}
        <Divider />
        <TagDeleteDialog />

        <form onSubmit={onFormSubmit}>
          <DialogContent> {content} </DialogContent>
          <Divider />
          {actions && <DialogActions> {actions} </DialogActions>}
        </form>
      </Dialog>
    );
  }

  if (isPending) { return Dlg(<LinearProgress />); }
  if (isError) {
    return Dlg(
      <Alert severity="error"> {error?.message || "An error occurred. Please try again"}</Alert>
    );
  }

  const con = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        {fields.map((fds: itemFields) => getSimpleField(fds))}
        {getPropField()}
        {getTagField()}
      </Stack>
    </Box>
  );

  const dummyAction = () => undefined;

  const canDelete = !formIsSubmitting && formStateId !== "";
  const saveIcon = formIsSubmitting ? <HourglassOutlineIcon height="1.5rem" /> :
    formCanSubmit ? <SaveIcon height="1.5rem" /> : <SaveOffIcon height="1.5rem" />
  const act = (
    <ItemFormSpeedDialBox>
      <SpeedDial ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />} >
        <SpeedDialAction
          key={"delete"}
          icon={canDelete ? <DeleteIcon height="1.5rem" /> : <DeleteOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={canDelete ? handleDelete : dummyAction}
          slotProps={{
            tooltip: { title: formCanSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={"save"}
          icon={saveIcon}
          // @ts-ignore
          onClick={formCanSubmit ? form.handleSubmit : dummyAction}
          slotProps={{
            tooltip: { title: formCanSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={formIsDirty ? "reset" : "No changes yet"}
          icon={formIsDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={formIsDirty ? form.reset : dummyAction}
          slotProps={{
            tooltip: { title: formIsDirty ? "reset" : "no changes yet", },
          }}
        />
      </SpeedDial>
    </ItemFormSpeedDialBox>
  );

  if (formIsSubmitting) {
    // ToDo: Verify that this works
    return <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  }
  return Dlg(con, act);
}
