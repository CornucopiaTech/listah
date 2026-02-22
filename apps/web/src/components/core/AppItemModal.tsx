
import {
  Fragment,
} from "react";
import type {
  ChangeEvent,
  // MouseEvent,
  ReactNode,
  FormEvent,
} from 'react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
// import { z } from 'zod'
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



// Internal imports
import { AppResetButton } from "@/components/core/AppButton";
import {
  SpaceBetweenBox,
} from "@/components/core/Box";
import { AppH6ButtonTypography } from "@/components/core/ButtonTypography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DEFAULT_ITEM } from '@/lib/helper/defaults';
import {
  ZItem
} from "@/lib/model/item";
import { postItem } from "@/lib/helper/fetchers";
import { useSearchQuery } from '@/lib/context/queryContext';
import type {
  IItem,
  IItemRequest,
} from "@/lib/model/item";




type itemFields = "id" | "tag" | "title" | "userId" | "category" | "description" | "note" | "softDelete" | "reactivateAt" | `tag[${number}]`

export function AppItemModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const item: IItem = useBoundStore((state) => state.displayItem);
  const query: IItemRequest = useSearchQuery();
  const queryClient = useQueryClient();
  const { user } = useUser();

  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IItem) => {
      const mi = ZItem.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item", query] }),
        queryClient.invalidateQueries({ queryKey: ["tag", query] }),
        queryClient.invalidateQueries({ queryKey: ["savedFilter", query] }),
        queryClient.invalidateQueries({ queryKey: ["category", query] }),
      ])
    },
  });



  function closeModal(){
    store.setModal(false);
    store.setDisplayId("");
    store.setDisplayItem(DEFAULT_ITEM);
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
    closeModal()
    store.setMessage("Item updated");
  }
  const form = useForm({
    defaultValues: item,
    onSubmit: ({ value }) => {
      const itemId = value.id && value.id != "" ? value.id : uuidv4();
      const userId = value.userId != "" ? value.userId : user.id;
      const submitValue = {
      ...value,
        userId,
      id: itemId,
      tag: value.tag?.filter((t) => t != "")
    }
      mutation.mutate(submitValue);
    },
  });

  function getSimpleField(key: itemFields){
    const sx = (key == "id" || key == "userId") ? { display: 'none' } : {}
    return (
      <form.Field
        key={`item-${key}`}
        name={key}
        children={
          (field) =>
            <Grid container sx={{width: '100%'}} spacing={1}>
              <Grid size={11}>
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
              <Grid size={1}>
                <Icon
                  icon="material-symbols-light:cancel-outline"
                  width="24" height="24"
                  onClick={() => field.handleChange("")}
                  style={sx}
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
                Add new tag
              </Button>
              {
                field.state.value &&
                <Grid container spacing={1}>
                  {
                    field.state.value.map(
                      (_, i) => {
                        return <form.Field key={i} name={`tag[${i}]`}>
                          {
                            (subField) => {
                              return (
                                <Grid size={{ xs: 12, md: 6 }}
                                  sx={{
                                    px: 1,
                                    // display: 'flex', justifyContent: 'space-around', alignItems: "center"
                                  }}
                                  >
                                  <TextField
                                    multiline
                                    id={"item-tag-" + i}
                                    value={subField.state.value}
                                    // value={subField.state.value ? subField.state.value : _}
                                    label={"tag-" + (i + 1)}
                                    onChange={
                                      (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                        subField.handleChange(e.target.value)
                                    }
                                    size="small"
                                    variant="standard"
                                  />
                                  <Icon
                                    icon="material-symbols:close-rounded"
                                    width="24" height="24"
                                    onClick={() => subField.handleChange("")}
                                  />
                                </Grid>
                              )
                            }
                          }
                        </form.Field>
                      }
                    )
                  }
                </Grid>
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
    overflow: 'scroll',
    height: '70vh',
    maxHeight: 720,
  }

  return (
    <Dialog fullWidth open={store.modal} onClose={closeModal}>
      <IconButton aria-label="delete"
          sx={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          }}
        onClick={closeModal}>
        <Icon icon="material-symbols-light:close-rounded" width="40" height="40" />
      </IconButton>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={dialogSx} >
          <Stack spacing={2}>
            {fields.map((fds: itemFields) => getSimpleField(fds)) }
            { getTagField() }
          </Stack>
        </DialogContent>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <SpaceBetweenBox sx={{}}>
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
