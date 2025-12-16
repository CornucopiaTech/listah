

import {
  type ReactNode,
  useContext,
  Suspense,
} from 'react';
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
import * as z from "zod";



import { defaultUpdateItemInitState } from '@/lib/store/updatedItem/updatedItemStore';
import { useItemsStore } from '@/lib/store/items/ItemsStoreProvider';
import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import type { ItemProto, ItemsProto, ZItemProto , ZItemsProto } from '@/lib/model/ItemsModel';
import { postItem, getItem, getValidItem } from '@/lib/utils/itemHelper';
import { WebAppContext } from "@/lib/context/webappContext";
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import { Route } from '@/routes/items/$itemId';
import { getItemsGroupOptions } from '@/lib/utils/itemHelper';



export default function ItemDetails(): ReactNode {
  const { itemId } = Route.useParams()
  const upItemStore = useUpdatedItemStore((state) => state);
  const itemStore = useItemsStore((state) => state);
  const queryClient = useQueryClient();
  const webState = useContext(WebAppContext);


  // Define update item store mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: ItemProto) => {
      const mi = ZItemProto.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: (data, variables) => {
      // queryClient.invalidateQueries({ queryKey: ["getItems", usedItem.userId, categoryFilter, tagFilter, currentPage, itemsPerPage,] })
      queryClient.setQueryData([
        [
          "getItems", webState.userId, itemStore.categoryFilter,
          itemStore.tagFilter, itemStore.currentPage, itemStore.itemsPerPage
        ], { id: variables.id }
      ], data)
    },
  });


  // Get the item data from the API
  const { isPending, isError, data, error }: UseQueryResult<ItemsProto> = useQuery(getItemsGroupOptions(webState.userId, itemStore.categoryFilter, itemStore.tagFilter, itemStore.currentPage, itemStore.itemsPerPage));

  if (isPending) { return <Loading />; }
  // ToDo: Fix this error message
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  let apiItems: ItemsProto;
  let usedItem: ItemProto;
  try{
    apiItems = ZItemsProto.parse(data);
    let uit: ItemProto = apiItems.items.find((it) => it.id === itemId);
    usedItem = ZItemProto.parse(getValidItem(upItemStore.item, uit));
    console.info("0. usedItem");
    console.info(usedItem);
    console.info(upItemStore.item);
    console.info(uit);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info(error.issues);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
    }
  }


  // // Get the item to be used

  // try {


  // } catch (error) {
  //   if (error instanceof z.ZodError) {
  //     console.info(error.issues);
  //     return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
  //   }
  // }


  function addNewTag (){
    if (!upItemStore.newTag || upItemStore.newTag.trim() == "") {
      return;
    }
    let tList: string[];
    if (!usedItem.tag || usedItem.tag.length == 0) {
      tList = [upItemStore.newTag]
    } else {
      tList = [upItemStore.newTag, ...usedItem.tag];
    }
    // updateTags(tList);
    upItemStore.updateNewTag(null);
    let newState = {...usedItem, tag: tList}
    upItemStore.setState(newState);
  }

  function handleTag (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, oldT: string, newT: string){
    e.preventDefault();
    e.stopPropagation();
    let tList: string[];

    if (!usedItem.tag || usedItem.tag.length == 0){
      // If no tags, just add the new one
      tList = [ newT ]
    } else {
    // Replace the old tag with the new one
      const idx = usedItem.tag.indexOf(oldT);
      if (idx == -1) {
      // If no old tag found, just add the new one
        tList = [newT, ...usedItem.tag]
      } else {
      // Replace the tag at the found index
        tList = [...usedItem.tag.toSpliced(idx, 1, newT)]
      }
    }
    // updateTags(tList);
    let newState = {...usedItem, tag: tList}
    upItemStore.setState(newState);
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
    upItemStore.setState(newState);
  }

  function handleSave(){
    let editedTag: string[];
    if (upItemStore.newTag != null && upItemStore.newTag.trim() != ""){
      // IF a new tag exists
      if (!usedItem.tag || usedItem.tag.length == 0){
        // If no tags, just add the new one
        editedTag = [ upItemStore.newTag ]
      } else {
        // Add the new tag to existing tags
        editedTag = [ upItemStore.newTag, ...usedItem.tag ]
      }
    } else {
      // If no new tag, use existing tags
      editedTag = usedItem.tag
    }
    const saveItem: ItemProto = {...usedItem, tag: editedTag}
    mutation.mutate(saveItem);
    upItemStore.setState(saveItem);
    upItemStore.updateNewTag(null);
  }

  function handleDelete(){
    const deleteItem: ItemProto= {...usedItem, softDelete: true}
    mutation.mutate(deleteItem);
    upItemStore.setState(defaultUpdateItemInitState);
    // router.push(`/items/read`);
  }

  function handleClose(){
    upItemStore.setState(defaultUpdateItemInitState);
    // router.push(`/items/read`);
  }

  console.info("usedItem");
  console.info(usedItem);

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

      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
      {mutation.isSuccess ? <div>Todo added!</div> : null}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { upItemStore.updateSummary(e.target.value)} } size='small'
        />
        <TextField
          required multiline key={`${ usedItem.id }-category`}
          label="Category" value={ usedItem.category}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { upItemStore.updateCategory(e.target.value)} } size='small'
        />
        <TextField
            required multiline key={`${ usedItem.id }-description`}
            label="Description" value={ usedItem.description }
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { upItemStore.updateDescription(e.target.value)} } size='small'
        />
        <TextField
          required multiline key={`${ usedItem.id }-note`}
          label="Note" value={ usedItem.note}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { upItemStore.updateNote(e.target.value)} } size='small'
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
                value={ upItemStore.newTag ? upItemStore.newTag : "" }
                size='small'
                onChange={
                  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { upItemStore.updateNewTag(e.target.value)}
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
