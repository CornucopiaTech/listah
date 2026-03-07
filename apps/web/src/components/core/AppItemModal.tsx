
import {
  Fragment,
  useEffect,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
  FormEvent,
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
import { useUser } from '@clerk/clerk-react';
import { useTheme } from "@mui/material";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';


// Internal imports
import { AppBody1Typography } from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DEFAULT_ITEM } from '@/lib/helper/defaults';
import {
  ZItem
} from "@/lib/model/item";
import { postItem } from "@/lib/helper/fetchers";
import type {
  IItem,
  IItemReadRequest,
} from "@/lib/model/item";
import { ErrorAlert, SuccessAlert, WarnAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import { decodeState } from "@/lib/helper/encoders";
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';



type itemFields = "id" | "tag" | "title" | "userId" | "description" | "note" | "softDelete" | `tag[${number}]`

export function AppItemModal(
  { route }: { route: "/" | "/items/$title"  }
): ReactNode {


  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const item: IItem = useBoundStore((state) => state.displayItem);
  const routeApi = getRouteApi(route);
  const routeSearch: { s: string } = routeApi.useSearch()
  let search: IItemReadRequest = decodeState(routeSearch.s) as IItemReadRequest;
  const query: IItemReadRequest = { ...search, userId: user?.id || "" };
  const queryClient = useQueryClient();
  const theme: AppTheme = useTheme();
  const form = useForm({
    defaultValues: item,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IItem }) {
        if (value.title.length < 1) {
          return "Item title is required";
        }
        if (value.tag.length < 1) {
          return "A least one tag is required";
        }
        return undefined
      },
      onBlur({ value }: { value: IItem }) {
        if (value.title.length < 1) {
          return "Item title is required";
        }
        if (value.tag.length < 1) {
          return "A least one tag is required";
        }
        return undefined
      },
    },
  });
  const catQuery = {
    savedFilter: {
      ...DefaultHomeQueryParams.savedFilter,
      userId: user?.id || "",
      pageSize: -1,
    },
    tag: {
      ...DefaultHomeQueryParams.tag,
      userId: user?.id || "",
      pageSize: -1,
    }
  }

  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IItem) => {
      const mi = ZItem.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item", query] }),
        queryClient.invalidateQueries({ queryKey: ["tag", catQuery.tag] }),
        queryClient.invalidateQueries({ queryKey: ["savedFilter", catQuery.savedFilter] }),
      ])
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;

    const timer = setTimeout(
      () => {
        console.log("Timer fired after 2 seconds");
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted, mutation.isSuccess]);


  function closeModal(){
    store.setItemModal(false);
    store.setDisplayId("");
    store.setDisplayItem(DEFAULT_ITEM);
  }

  function onFormSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: IItem }) {
    console.log("In formSubmission - value ", value);
    const itemId = value.id && value.id != "" ? value.id : uuidv4();
    const userId = user && user.id ? user.id : value.userId;
    const submitValue = {
      ...value,
        userId,
      id: itemId,
      tag: value.tag?.filter((t) => t != "")
    }
    console.log("In formSubmission - submitValue ", submitValue);
    mutation.mutate(submitValue);

  }

  function getSimpleField(key: itemFields){
    const sx = (key == "id" || key == "userId") ? { display: 'none' } : {}
    return (
      <form.Field
        key={`item-${key}`}
        name={key}
        children={
          (field) =>
            <Grid container sx={{width: '100%'}} spacing={1}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  id={`item-${key}`}
                  key={`item-${key}`}
                  value={field.state.value}
                  label={key}
                  onChange={
                    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                  sx={sx}
                  size="small"
                  variant="standard"
                />
              </Grid>
          </Grid>
        }
      />
    );
  }

  function getTagField(){
    return (
      <form.Field name="tag" mode="array">
        {
          (field) => (
            <Fragment>
              <Button
                onClick={() => field.pushValue('')}
                type="button">
                  <AppBody1Typography>Add new tag</AppBody1Typography>

              </Button>
              {
                field.state.value &&
                <Grid container spacing={1} sx={{width: '100%'}}>{
                  field.state.value.map((_, i) => {
                    return <form.Field key={i} name={`tag[${i}]`}>{
                      (subField) => {
                        return (
                          <Grid size={{ xs:12, sm: 6, md: 6 }}>
                            <TextField
                              multiline
                              id={"item-tag-" + i}
                              value={subField.state.value}
                              label={"tag[" + (i + 1) + "]"}
                              onChange={
                                (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                  subField.handleChange(e.target.value)
                              }
                              size="small"
                              variant="standard"
                            />
                          </Grid>
                        )
                      }
                    }</form.Field>
                  })
                }</Grid>
              }
            </Fragment>
          )
        }
      </form.Field>
    );
  }

  function handleDelete(){
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  function handleClone(){
    const title = form.state.values.title || "";
    form.setFieldValue('id', uuidv4());
    form.setFieldValue('title', "[Clone of] - " + title);
  }

  const fields: itemFields[] = ['id', 'userId', 'title', 'description', 'note'];
  const dialogSx = {
    display: 'block',
    maxWidth: "lg",
    height: '70vh',
    maxHeight: 720,
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





  const deleteIcon = form.state.isSubmitting ? "ic:baseline-auto-delete" : (!form.state.canSubmit || form.state.values.id == "") ? "mdi:delete-off" : "ic:sharp-delete" ;
  const deleteTooltip = (!form.state.canSubmit || form.state.values.id == "") ? "Unable to delete" : "Delete";

  const saveIcon = form.state.isSubmitting ? "material-symbols:hourglass-top" : form.state.canSubmit ? "material-symbols:save-sharp" : "lucide:save-off";
  const saveTooltip = !form.state.canSubmit ? "Unable to save" : "Save";
  const cloneIcon = form.state.values.id == "" ? "tabler:copy-off" : "material-symbols:content-copy-sharp";
  const cloneTooltip = form.state.values.id == "" ? "Unable to clone" : "Clone";


  const formActions = [
    {name: cloneTooltip, icon: cloneIcon, onClick: handleClone},
    {name: deleteTooltip, icon: deleteIcon, onClick: handleDelete},
    {name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit},
    {name: "Reset", icon: "material-symbols-light:restart-alt", onClick: form.reset},
  ]
  const formErrorMap = useStore(form.store, (state) => state.errorMap)

  return (
    <Dialog fullWidth open={store.itemModal} onClose={closeModal} >
      <IconButton aria-label="delete"
          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
        onClick={closeModal}>
        <Icon icon="material-symbols-light:close-rounded" width="40" height="40" />
      </IconButton>
      <form onSubmit={onFormSubmit}>
        <DialogContent sx={dialogSx} >
          <Stack spacing={3} sx={{ width: '100%' }} >
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
            {fields.map((fds: itemFields) => getSimpleField(fds)) }
            { getTagField() }
          </Stack>
        </DialogContent>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.values.title]}
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
        </DialogActions>
      </form>
    </Dialog>
  );
}


