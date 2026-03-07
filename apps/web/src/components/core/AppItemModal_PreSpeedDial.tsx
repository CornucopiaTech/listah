
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


// Internal imports
import { AppResetButton } from "@/components/core/AppButton";
import {
  SpaceBetweenBox,
} from "@/components/core/Box";
import { AppH6ButtonTypography } from "@/components/core/ButtonTypography";
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
import { ErrorAlert, SuccessAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import { decodeState } from "@/lib/helper/encoders";
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';



type itemFields = "id" | "tag" | "title" | "userId" | "description" | "note" | "softDelete" |  `tag[${number}]`

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
  });
  useEffect(() => {
    if (!form.state.isSubmitted) return;

    const timer = setTimeout(
      () => {
        console.log("Timer fired after 2 seconds");
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted]);

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
      store.setMessage(error.message);
    },
  });




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

  return (
    <Dialog fullWidth open={store.itemModal} onClose={closeModal} >
      <IconButton aria-label="delete"
          sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
        onClick={closeModal}>
        <Icon icon="material-symbols-light:close-rounded" width="40" height="40" />
      </IconButton>

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

      <form onSubmit={onFormSubmit}>
        <DialogContent sx={dialogSx} >
          <Stack spacing={3} sx={{ width: '100%' }} >
            {fields.map((fds: itemFields) => getSimpleField(fds)) }
            { getTagField() }
          </Stack>
        </DialogContent>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.values.title]}
            children={([canSubmit, isSubmitting, title]) => (
              <SpaceBetweenBox sx={{}}>
                <AppResetButton
                      variant="contained"
                      onClick={() => {
                        form.setFieldValue('id', uuidv4());
                        form.setFieldValue('title', "[Clone of] - " + title);
                      }}
                    >
                  <AppH6ButtonTypography>Clone</AppH6ButtonTypography>
                </AppResetButton>
                <AppResetButton
                    type="submit"
                    variant="contained"
                    disabled={!canSubmit}
                    onClick={() => {
                      form.setFieldValue('softDelete', true);
                      form.handleSubmit();
                    }}
                  >
                  <AppH6ButtonTypography>Delete</AppH6ButtonTypography>
                </AppResetButton>
                <AppResetButton
                    type="submit"
                    variant="contained"
                    disabled={!canSubmit}
                    onClick={form.handleSubmit}
                  >
                  <AppH6ButtonTypography>
                    {isSubmitting ? '...' : 'Submit'}
                  </AppH6ButtonTypography>
                </AppResetButton>

                <AppResetButton
                    type="reset"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault()
                      form.reset()
                    }}
                  >
                  <AppH6ButtonTypography>Reset</AppH6ButtonTypography>
                </AppResetButton>
              </SpaceBetweenBox>
            )}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
