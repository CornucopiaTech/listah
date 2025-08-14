"use client"

import {
  useRef
} from 'react';
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
import { ItemProto } from '@/lib/model/ItemsModel';
import { getValidItem, postItem } from '@/lib/utils/itemHelper';


export default function ItemUpdate({ pItem }: {
  pItem?: ItemProto
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
    defaultUpdateItemInitState,
  } = useUpdatedItemStore((state) => state);
    const {
      itemsPerPage,
      currentPage,
      categoryFilter,
      tagFilter,
    } = useItemsStore((state) => state);

  const searchParams = useSearchParams();
  const query = searchParams.get('q') ? searchParams.get('q') : "";
  const passed = query == "" ? {} : JSON.parse(window.atob(query));
  const usedItem: ItemProto= getValidItem(passed, item);
  const mutation = useMutation({
    mutationFn: (mutateItem: ItemProto) => {
      return postItem(mutateItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getItems", usedItem.userId, categoryFilter, tagFilter, currentPage, itemsPerPage,] })
    },
  });


  function addNewTag (){
    if (!newTag || newTag.trim() == "") {
      return;
    }
    let tList: string[];
    if (!usedItem.tags || usedItem.tags.length == 0) {
      tList = [newTag]
    } else {
      tList = [newTag, ...usedItem.tags];
    }
    updateTags(tList);
    updateNewTag(null);
    // router.push(pathname + '?' + createQueryString('sort', 'asc'))
  }

  function handleTag (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, oldT: string, newT: string){
    e.preventDefault();
    let tList: string[];

    if (!usedItem.tags || usedItem.tags.length == 0){
      tList = [ newT ]
    } else {
      const idx = usedItem.tags.indexOf(oldT);
      if (idx == -1) {
        tList = [newT, ...usedItem.tags]
      } else {
        tList = [...usedItem.tags.toSpliced(idx, 1, newT)]
      }
    }
    updateTags(tList);
  }

  function removeTag (e:React.ChangeEvent<HTMLButtonElement>, oldT: string){
    e.preventDefault();
    if (!usedItem.tags || usedItem.tags.length == 0){
      return;
    }
    const updatedTags = usedItem.tags.filter((i) => i != oldT);
    updateTags(updatedTags);
  }

  function handleSave(){
    let editedTag: string[];
    if (newTag != null && newTag.trim() != ""){
      if (!usedItem.tags || usedItem.tags.length == 0){
        editedTag = [ newTag ]
      } else {
        editedTag = [ newTag, ...usedItem.tags ]
      }
    } else {
      editedTag = usedItem.tags
    }
    const saveItem: ItemProto= {...usedItem, userId: usedItem.userId, id: usedItem.id, tags: editedTag}
    mutation.mutate(saveItem);
    setState(saveItem);
    updateNewTag(null);

    const q = window.btoa(JSON.stringify(saveItem));
    router.push(`/item/read?q=${q}`);
  }

  function handleDelete(){
    const deleteItem: ItemProto= {...usedItem, userId: passed.userId, id: passed.id, softDelete: true}
    mutation.mutate(deleteItem);
    setState(defaultUpdateItemInitState);
    updateNewTag(null);

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
              display: 'inline-flex', p: 1,
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
