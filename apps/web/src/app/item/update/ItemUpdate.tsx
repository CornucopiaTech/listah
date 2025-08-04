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
    Save,
    Delete,
    Add,
    Close,
 } from '@mui/icons-material';


import { useItemsStore } from '@/lib/store/items/ItemsStoreProvider';
import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import type { IProtoItem } from '@/app/items/ItemsModel';


async function postItem(item: IProtoItem) {
  console.info("In postItem");
  console.info(item);
  const req = new Request("/api/postItem", {
    method: "POST",
    body: JSON.stringify({items: [item]}),
    headers: {"Content-Type": "application/json", "Accept": "*/*",},
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

export default function ItemUpdate({ pItem }: {
  pItem?: IProtoItem
}): React.ReactNode {
  const itemsKey = "itemsDetails";
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    item,
    newTag,
    setState,
    updateSummary,
    updateCategory,
    updateDescription,
    updateNote,
    updateTags,
    updateSoftDelete,
    updateProperties,
    updateReactivateAt,
    updateNewTag,
    // addNewTag,
  } = useUpdatedItemStore((state) => state);
    const {
      itemsPerPage,
      currentPage,
      categoryFilter,
      tagFilter,
      modalOpen,
      inEditMode,
      updateItemsPageRecordCount,
      updateItemsCurrentPage,
      updateItemsCategoryFilter,
      updateItemsTagFilter,
      updateModal,
      updateEditMode,
    } = useItemsStore((state) => state);

  const searchParams = useSearchParams();
  const query = searchParams.get('q') ? searchParams.get('q') : "";
  const passed = JSON.parse(window.atob(query));

  const usedItem: IProtoItem = {
    id: passed.id,
    userId: passed.userId,
    summary: item.summary ? item.summary : passed.summary,
    category: item.category ? item.category : passed.category,
    description: item.description ? item.description : passed.description,
    note: item.note ? item.note : passed.note,
    tags: item.tags ? item.tags : passed.tags,
    softDelete: item.softDelete ? item.softDelete : passed.softDelete,
    properties: item.properties ? item.properties : passed.properties,
  };

  const mutation = useMutation({
    mutationFn: (mutateItem: IProtoItem) => {
      return postItem(mutateItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getItems", usedItem.userId, categoryFilter, tagFilter, currentPage, itemsPerPage,] })
    },
  });


  function addNewTag (){
    updateTags([newTag, ...usedItem.tags]);
    updateNewTag("");
  }

  function handleTag (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, oldT: string, newT: string){
    e.preventDefault();
    const idx = usedItem.tags.indexOf(oldT);
    let tList;
    if (idx == -1){
      tList = [...usedItem.tags, newT]
    } else {
      tList = usedItem.tags.toSpliced(idx, 1, newT)
    }
    updateTags(tList);
  }

  function removeTag (e:React.ChangeEvent<HTMLButtonElement>, oldT: string){
    e.preventDefault();
    updateTags(usedItem.tags.filter((i) => i != oldT));
  }



  function handleSave(){
    let editedTag: string[];
    if (newTag != ""){
      if (usedItem.tags.length == 0){
        editedTag = [newTag]
      } else {
        editedTag = [newTag, ...usedItem.tags]
      }
    } else {
      editedTag = [usedItem.tags]
    }
    const saveItem: IProtoItem = {...usedItem, userId: usedItem.userId, id: usedItem.id, tags: editedTag}
    mutation.mutate(saveItem);
    const q = window.btoa(JSON.stringify(saveItem));
    router.push(`/item/read?q=${q}`);
  }

  function handleDelete(){
    const deleteItem: IProtoItem = {...usedItem, userId: passed.userId, id: passed.id, softDelete: true}
    mutation.mutate(deleteItem);
    router.push(`/items/read`);
  }

  function handleClose(){
    router.push(`/items/read`);
  }

  return (
    <Box
        sx={{
          width: '100%', flexGrow: 1, alignItems: 'center',
          height: '100%', justifyContent: 'center',
        }}>
      <Stack
          spacing={ 2 } direction="row" key={ `${usedItem.id}-Buttons` }
          sx={{ width: '100%', justifyContent: 'space-around',
              dislay: 'inline-flex', p: 1,
          }}>
        <IconButton onClick={ handleClose }>
          <Tooltip title="Close"><Close/></Tooltip>
        </IconButton>
        <IconButton onClick={ handleSave }>
          <Tooltip title="Save Item"><Save/></Tooltip>
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
        <TextField required multiline key={`${usedItem.id}-summary`}
          label='Summary' value={ usedItem.summary}
          onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateSummary(e.target.value)} } size='small'
        />
        <TextField
          required multiline key={`${ usedItem.id }-category`}
          label="Category" value={ usedItem.category}
          onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateCategory(e.target.value)} } size='small'
        />
        <TextField
            required multiline key={`${ usedItem.id }-description`}
            label="Description" value={ usedItem.description }
            onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateDescription(e.target.value)} } size='small'
        />
        <TextField
          required multiline key={`${ usedItem.id }-note`}
          label="Note" value={ usedItem.note}
          onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateNote(e.target.value)} } size='small'
        />
        <List
          key="tag-list"
          sx={{ width: '100%', maxWidth: 360, }}
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader"
              sx={{ display: 'flex' }}>
              <ListItemText primary="Tags" />
            </ListSubheader>
          }>

          <ListItemButton key={ `${ usedItem.id }-newtag` }>
            <TextField required multiline
                key={ `${ usedItem.id }-newtag` }
                value={ newTag ? newTag : "" }
                size='small'
                onChange={
                  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateNewTag(e.target.value)}
                }
            />
            <IconButton onClick={addNewTag}>
              <Tooltip title="Add New Tag"><Add/></Tooltip>
            </IconButton>
          </ListItemButton>
          {
            // Since the value is changed, dont use it as key, else React will re-render instead of re-using the component and it will lose focus.
            usedItem.tags && usedItem.tags.length > 0 &&
            usedItem.tags.map((tagItem: string, id: number) => (
              <ListItemButton key={ 'tag-' + id + '-formField' }>
                <TextField required multiline
                    key={ 'tag-' + id + 'formField' }
                    value={ tagItem }
                    size='small'
                    onChange={
                      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {handleTag(e, tagItem, e.target.value)}
                    }
                />
                <IconButton onClick={
                      (e: React.ChangeEvent<HTMLButtonElement>) => {removeTag(e, tagItem)}
                    }>
                  <Tooltip title="Delete Tag"><Close/></Tooltip>
                </IconButton>

              </ListItemButton>
            ))
          }
        </List>
      </Box>
    </Box>
  );
}
