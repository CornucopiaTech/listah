"use client"

import {
  ReactNode,
  useContext,
} from 'react';
import {
  useRouter, useParams
} from 'next/navigation';
import {
  useQueryClient,
  useMutation,
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
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
import { ItemProto, ItemsProto, } from '@/lib/model/ItemsModel';
import { postItem, getItem } from '@/lib/utils/itemHelper';
import { WebAppContext } from "@/lib/context/webappContext";
import Loading from '@/components/Loading';
import { ErrorAlerts } from '@/components/ErrorAlert';


export default function ItemUpdate(): ReactNode {
  const params: { itemId: string } = useParams<{ itemId: string }>();
  const { itemId } = params

  const {
    item,
    newTag,
    setState,
    updateSummary,
    updateCategory,
    updateDescription,
    updateNote,
    updateTags,
    // updateSoftDelete,
    // updateProperties,
    // updateReactivateAt,
    updateNewTag,
    defaultUpdateItemInitState,
  } = useUpdatedItemStore((state) => state);
  const {
    itemsPerPage,
    currentPage,
    categoryFilter,
    tagFilter,
  } = useItemsStore((state) => state);

  const router = useRouter();
  const queryClient = useQueryClient();
  const webState = useContext(WebAppContext);
  const userId: string = webState.userId;
  const recordsPerPage: number = itemsPerPage;
  const page: number = currentPage;
  const category: string[] = categoryFilter;
  const tag: string[] = tagFilter;

  function getItemGroupOptions(itemId: string, userId: string, category: string [], tag: string[], pageNumber: number, recordsPerPage: number) {
  return queryOptions({
    queryKey: ["getItem", userId, itemId],
    queryFn: () => getItem(userId, itemId),
    initialData: () => {
      const state: any = queryClient.getQueryState(['getItems', userId, category, tag, pageNumber, recordsPerPage]);

      if (state && Date.now() - state.dataUpdatedAt <= 24 * 60 * 60 * 1000 ){
        return state.data.find((d: ItemProto) => d.id === itemId);
     }
    },
     staleTime: 24 * 60 * 60 * 1000,
   })
  }
  const mutation = useMutation({
    mutationFn: (mutateItem: ItemProto) => {
      return postItem(mutateItem);
    },
    onSuccess: (data, variables) => {
      // queryClient.invalidateQueries({ queryKey: ["getItems", usedItem.userId, categoryFilter, tagFilter, currentPage, itemsPerPage,] })
      queryClient.setQueryData([["getItems", usedItem.userId, categoryFilter, tagFilter, currentPage, itemsPerPage], { id: variables.id }], data)
      queryClient.setQueryData([["getItem", variables.userId, variables.id], { id: variables.id }], data)
    },
  });


  // const { isPending, isError, data, error }: UseQueryResult<ItemsProto> = useQuery(getItemGroupOptions(itemId, userId, category, tag, page, recordsPerPage));

  // if (isPending) { return <Loading />; }
  // // ToDo: Fix this error message
  // if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  let usedItem: ItemProto = {...item};

  // if (item.id !== null){
  //   usedItem = {...item}
  // } else {
  //   usedItem = data.items && data.items.length > 0 ? data.items[0] : [];
  // }



  function addNewTag (){
    if (!newTag || newTag.trim() == "") {
      return;
    }
    let tList: string[];
    if (!usedItem.tag || usedItem.tag.length == 0) {
      tList = [newTag]
    } else {
      tList = [newTag, ...usedItem.tag];
    }
    // updateTags(tList);
    updateNewTag(null);
    let newState = {...usedItem, tag: tList}
    setState(newState);
    // router.push(pathname + '?' + createQueryString('sort', 'asc'))
  }

  function handleTag (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, oldT: string, newT: string){
    e.preventDefault();
    e.stopPropagation();
    let tList: string[];

    if (!usedItem.tag || usedItem.tag.length == 0){
      tList = [ newT ]
    } else {
      const idx = usedItem.tag.indexOf(oldT);
      if (idx == -1) {
        tList = [newT, ...usedItem.tag]
      } else {
        tList = [...usedItem.tag.toSpliced(idx, 1, newT)]
      }
    }
    // updateTags(tList);
    let newState = {...usedItem, tag: tList}
    setState(newState);
  }

  function removeTag (e:React.ChangeEvent<HTMLButtonElement>, oldT: string){
    e.preventDefault();
    e.stopPropagation();
    if (!usedItem.tag || usedItem.tag.length == 0){
      return;
    }
    const updatedTags = usedItem.tag.filter((i) => i != oldT);
    // updateTags(updatedTags);
    let newState = {...usedItem, tag: updatedTags}
    setState(newState);
  }

  function handleSave(){
    let editedTag: string[];
    if (newTag != null && newTag.trim() != ""){
      if (!usedItem.tag || usedItem.tag.length == 0){
        editedTag = [ newTag ]
      } else {
        editedTag = [ newTag, ...usedItem.tag ]
      }
    } else {
      editedTag = usedItem.tag
    }
    const saveItem: ItemProto= {...usedItem, tag: editedTag}
    mutation.mutate(saveItem);
    setState(saveItem);
    updateNewTag(null);

    // router.push(`/item/${saveItem.id}`);
  }

  function handleDelete(){
    const deleteItem: ItemProto= {...usedItem, softDelete: true}
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
            usedItem.tag && usedItem.tag.length > 0 &&
            usedItem.tag.map((tagItem: string, id: number) => (
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
