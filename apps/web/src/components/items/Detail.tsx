
import {
  useContext,
  // Fragment,
} from "react";
import type {
  ChangeEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import Button from '@mui/material/Button';
// import { z } from 'zod'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';



// Internal imports
import { useBoundStore } from '@/lib/store/boundStore';
import type { IItem } from "@/lib/model/Items";
import {
  SpaceBetweenBox,
} from "@/components/basics/Box";
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { itemGroupOptions } from '@/lib/helper/querying';
import { Error } from '@/components/common/Error';



export default function DialogDetail() {
  const theme: {} = useTheme();
  const store = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const {
    isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(itemGroupOptions(query));

  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }


  const items: IItem[] = data.items ? data.items : [];
  const displayItem: IItem | undefined = items.find((item) => item.id === store.displayId);

  if (!displayItem) {
    return <Error message="Item not found." />;
  }

  const form = useForm({
    defaultValues: displayItem,
    onSubmit: ({ value }) => {
      console.info('Submit value', value);
      alert(JSON.stringify(value, null, 2))
    },
  });


  function handleSubmit(e: MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }
  function getSimpleField(key: string){
    const sx = (key == "id" || key == "userId") ? { display: 'none' } : {}
    return (
      <form.Field
        name={key}
        children={
          (field) => <TextField
            multiline
            // autoFocus
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
        }
      />
    );
  }

  function getTagField(){
    return (
      <form.Field name="tag" mode="array">
        {
          (field) => (
            <Grid container spacing={1}>
              {
                field.state.value.map(
                  (_, i) => {
                    return <form.Field key={i} name={`tag[${i}].name`}>
                      {
                        (subField) => {
                          return (
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextField
                                multiline
                                id={"item-tag-" + i}
                                value={subField.state.value ? subField.state.value : _}
                                label={"tag-" + (i + 1)}
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
                      }
                    </form.Field>
                  }
                )
              }
            </Grid>
          )
        }
      </form.Field>
    );
  }

  function getPropertyField(){
    return <></>
    return (
      <form.Field name="properties" mode="array">
        {
          (field) => {
            let comps: Array<ReactNode>;
            for (const [key, value] of Object.entries(field.state.value)) {
              console.log(`${key}: ${value}`);
              comps.push(
                <Box sx={{ display: 'grid', gridTemplateRows: `repeat(2, 1fr)` }}>
                  <TextField
                    multiline
                    id={"item-property-" + key}
                    value={key}
                    // onChange={
                    //   (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                    //     subField.handleChange(e.target.value)
                    // }
                    size="small"
                    variant="standard"
                  /> :
                  <TextField
                    multiline
                    id={"item-property-" + value}
                    value={value}
                    // onChange={
                    //   (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                    //     subField.handleChange(e.target.value)
                    // }
                    size="small"
                    variant="standard"
                  />
                </Box>
              )
            }
            return comps;
          }
        }
      </form.Field>
    );
  }

  const fields: string[] = ['id', 'userId', 'summary', 'category', 'description', 'note'];
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
            { fields.map((fds: string) => getSimpleField(fds)) }
            { getTagField() }
            { getPropertyField() }
          </Stack>
        </DialogContent>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <SpaceBetweenBox>
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
