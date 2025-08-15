"use client"

import {
  useSearchParams, useRouter
} from 'next/navigation';
import {
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Tooltip,
 } from '@mui/material';

import {
    Delete,
    Close,
    Create,
 } from '@mui/icons-material';


import { useItemsStore } from '@/lib/store/items/ItemsStoreProvider';
import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import { ItemProto, } from '@/lib/model/ItemsModel';
import { getValidItem, postItem } from '@/lib/utils/itemHelper';




export default function ItemRead(): React.ReactNode {
  const itemsKey = "itemsDetails";
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ? searchParams.get('q') : "";
  const passed = query == "" ? {} : JSON.parse(window.atob(query));
  const {
    item,
  } = useUpdatedItemStore((state) => state);
  const {
    itemsPerPage,
    currentPage,
    categoryFilter,
    tagFilter,
    // modalOpen,
    // inEditMode,
    // updateItemsPageRecordCount,
    // updateItemsCurrentPage,
    // updateItemsCategoryFilter,
    // updateItemsTagFilter,
    // updateModal,
    updateEditMode,

  } = useItemsStore((state) => state);
  const {
    setState
  } = useUpdatedItemStore((state) => state);
  const usedItem: ItemProto= getValidItem(passed, item);
  const mutation = useMutation({
    mutationFn: (mutateItem: ItemProto) => {
      return postItem(mutateItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getItems", usedItem.userId, categoryFilter, tagFilter, currentPage, itemsPerPage,] })
    },
  });

  function handleEdit(){
    updateEditMode(true);
    setState(usedItem);
    const q = window.btoa(JSON.stringify(usedItem));
    router.push(`/item/update?q=${q}`);
  }

  function handleDelete(){
    const deleteItem = {...usedItem, userId: usedItem.userId, id: usedItem.id, softDelete: true}
    mutation.mutate(deleteItem);
    router.push(`/items/read`);
  }

  function handleClose(){
    router.push(`/items/read`);
  }

  return (
    <Grid size={{ xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
      <Box
          sx={{
            width: '100%', flexGrow: 1, alignItems: 'center',
            height: '100%', justifyContent: 'center',
          }}>
        <Stack
            spacing={ 2 } direction="row" key={ usedItem.id + '-Buttons' }
            sx={{ width: '100%', justifyContent: 'space-around',
                dislay: 'inline-flex', p: 1,
            }}>
          <IconButton onClick= { handleClose }>
            <Tooltip title="Close"><Close/></Tooltip>
          </IconButton>
          <IconButton onClick={handleEdit}>
            <Tooltip title="Edit"><Create/></Tooltip>
          </IconButton>
          <IconButton onClick={ handleDelete }>
            <Tooltip title="Delete Item"><Delete/></Tooltip>
          </IconButton>
        </Stack>
        <Box
            component="form" key={ `${usedItem.id}-Box` }
            noValidate autoComplete="off"
            sx={{
              '& .MuiTextField-root': {
                m: 1, width: '100%', maxWidth: 640,
              },
              width: '100%',  p: 2, overflow: 'auto',
              maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
            }}
            >
          <TextField disabled required multiline key={`${usedItem.id}-summary`}
            label='Summary' value={ usedItem.summary}
          />
          <TextField
            required disabled multiline key={`${ usedItem.id }-category`}
            label="Category" value={ usedItem.category}
          />
          <TextField
              required disabled multiline key={`${ usedItem.id }-description`}
              label="Description" value={ item.description ? item.description : passed.description }
          />
          <TextField
            required disabled multiline key={`${ usedItem.id }-note`}
            label="Note" value={ usedItem.note}
          />
          <List
            key="tag-list"
            sx={{ width: '100%', maxWidth: 360, }}
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader"
                sx={{ display: 'flex', opacity: 0.54 }}>
                <ListItemText primary="Tag" />
              </ListSubheader>
            }>
            {
              // Since the value is changed, dont use it as key, else React will re-render instead of re-using the component and it will lose focus.
              usedItem.tag && usedItem.tag.length > 0 &&
              usedItem.tag.map((tagItem: string, id: number) => (
                <ListItemButton key={ 'tag-' + id + '-formField' }>
                  <TextField disabled required multiline
                      key={ 'tag-' + id + 'formField' }
                      value={ tagItem }
                      size='small'
                      sx={{opacity: 0.54 }}
                  />
                  <IconButton>
                  </IconButton>
                </ListItemButton>
              ))
            }
          </List>
        </Box>
      </Box>
    </Grid>
  );
}
