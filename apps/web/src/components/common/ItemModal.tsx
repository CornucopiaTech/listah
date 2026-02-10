
import {
  useContext,
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
  useQuery,
  useQueryClient,
  useMutation,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  useParams,
} from '@tanstack/react-router';
// import { z } from 'zod'
import {
  v4 as uuidv4,
} from 'uuid';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Icon } from "@iconify/react";



// Internal imports
import { useBoundStore, type  TBoundStore } from '@/lib/store/boundStore';
import type {
  IItem,
  IItemsSearch,
  IItemResponse,
} from "@/lib/model/Items";
import {
  ZItem
} from "@/lib/model/Items";
import {
  SpaceBetweenBox,
} from "@/components/basics/Box";
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { itemGroupOptions } from '@/lib/helper/querying';
import { Error } from '@/components/common/Alerts';
import { postItem } from "@/lib/helper/fetchers";
import { DEFAULT_ITEM } from "@/lib/helper/defaults";
import type { AppTheme } from '@/lib/styles/theme';



export default function ItemModal(): ReactNode {
  const theme: AppTheme = useTheme();
  const store: TBoundStore = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const queryClient = useQueryClient();
  const { tagFilter: tagName, categoryFilter: categoryName } = useParams({ strict: false });

  console.info("tag filter", tagName)

  const {
    isPending, isError, data, error
  }: UseQueryResult<IItemResponse> = useQuery(itemGroupOptions(query));


  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IItem) => {
      const mi = ZItem.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item", query] }),
        queryClient.invalidateQueries({ queryKey: ["tag", query.userId] }),
        queryClient.invalidateQueries({ queryKey: ["category", query.userId] }),
      ])
    },
  });


  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }


  const items: IItem[] = data.items ? data.items : [];
  const displayItem: IItem | undefined = items.find((item) => item.id === store.displayId);


  // Define the item to use on the form
  const newItem = {
    ...DEFAULT_ITEM, id: uuidv4(), userId: query.userId,
    category: categoryName ? categoryName : "",
    tag: tagName ? [tagName] : []
  }
  const formItem: IItem = displayItem ? displayItem : newItem;


  const form = useForm({
    defaultValues: formItem,
    onSubmit: ({ value }) => {
      const submitValue = {...value, tag: value.tag?.filter((t) => t != "")}
      mutation.mutate(submitValue);
    },
  });


  function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
    store.setModal(false);
    store.setMessage("Item updated");
  }

  // function getSimpleField(key: string){
  function getSimpleField(key: "id" | "tag" | "summary" | "userId" | "category" | "description" | "note" | "softDelete" | "reactivateAt" | `tag[${number}]`){
    const sx = (key == "id" || key == "userId") ? { display: 'none' } : {}
    // const nameKey = key as string;
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
                  icon="material-symbols:close-rounded"
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

  const fields: ("id" | "userId" | "summary" | "category" | "description" | "note")[] = ['id', 'userId', 'summary', 'category', 'description', 'note'];
  const dialogSx = {
    display: 'block',
    maxWidth: "lg",
    overflow: 'scroll',
    height: '70vh',
    maxHeight: 720,
  }
  const buttonSx = {
    color: theme.palette.containedButton.contrastText,
    bgcolor: theme.palette.containedButton.main,
  }

  return (
    <Dialog fullWidth open={store.modal} onClose={() => store.setModal(false)}>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={dialogSx} >
          <Stack spacing={2}>
            {fields.map((fds: ("id" | "userId" | "summary" | "category" | "description" | "note")) => getSimpleField(fds)) }
            { getTagField() }
          </Stack>
        </DialogContent>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <SpaceBetweenBox sx={{}}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit}
                  sx={buttonSx}
                  onClick={form.handleSubmit}
                >
                  {isSubmitting ? '...' : 'Submit'}
                </Button>

                <Button
                  type="reset"
                  variant="contained"
                  sx={buttonSx}
                  onClick={(e) => {
                    e.preventDefault()
                    form.reset()
                  }}
                >
                  Reset
                </Button>
              </SpaceBetweenBox>
            )}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
