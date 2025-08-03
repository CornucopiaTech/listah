"use client"

import Link from 'next/link'
import {
  useQuery,
  useQueryClient,
  useMutation,
  type UseQueryResult
} from '@tanstack/react-query';
import {
    useContext,
    useRef,
    Fragment,
    useState
 } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Pagination,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
 } from '@mui/material';

import {
    Send,
    Delete,
    Add,
    Close,
 } from '@mui/icons-material';


import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import Loading from '@/components/Loading';


async function postItem(item: IProtoItem) {
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

export default function ItemDetails({ pItem }: {
  pItem: IProtoItem
}): React.ReactNode {
  const itemsKey = "itemsDetails";
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

  const tagsUsed = item.tags ? item.tags : pItem.tags;


  function addNewTag (){
    updateTags([newTag, ...tagsUsed]);
    updateNewTag("");
  }

  function handleTag (e, oldT, newT){
    e.preventDefault();
    const idx = tagsUsed.indexOf(oldT);
    let tList;
    if (idx == -1){
      tList = [...tagsUsed, newT]
    } else {
      tList = tagsUsed.toSpliced(idx, 1, newT)
    }
    updateTags(tList);
  }

  function handleSave (event){
    event.preventDefault();
    // alert("Submit buttone is clicked");
    const mutation = useMutation({
      mutationFn: () => postItem({...item, userId: pItem.userId, id: pItem.id}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [itemsKey] })
      },
    })
  }


  function handleSoftDelete (event){
    event.preventDefault();
    const mutation = useMutation({
      mutationFn: () => postItem({...item, userId: pItem.userId, id: pItem.id, softDelete: true}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [itemsKey] })
      },
    })
  }


  function handleMutation (){
    const mutation = useMutation({
      mutationFn: () => postItem({...item, userId: pItem.userId, id: pItem.id, softDelete: true}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [itemsKey] })
      },
    })
  }


  return (
    <Grid size={{ xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
      <Box
          sx={{
            width: '100%', flexGrow: 1, alignItems: 'center',
            height: '100%', justifyContent: 'center',
          }}>
        <form onSubmit={ handleSave }>
          <Stack
              spacing={ 2 } direction="row" key={ item.id ? item.id : pItem.id + '-Buttons' }
              sx={{ width: '100%', justifyContent: 'space-around',
                  dislay: 'inline-flex', p: 1,
              }}>
            <IconButton type="submit" >
              <Tooltip title="Save"><Send/></Tooltip>
            </IconButton>
            <IconButton onClick={ handleSoftDelete }>
              <Tooltip title="Delete"><Delete/></Tooltip>
            </IconButton>
          </Stack>
          <Box
              component="form" key={ `${item.id ? item.id : pItem.id}-Box` }
              noValidate autoComplete="off"
              sx={{
                '& .MuiTextField-root': {
                  m: 1, width: '100%', maxWidth: 640,
                },
                width: '100%',  p: 2, overflow: 'auto',
                maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
              }}
              >
            <TextField required multiline key={`${item.id ? item.id : pItem.id}-summary`}
              label='Summary' value={ item.summary ? item.summary : pItem.summary}
              onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {handleSummaryChange(e.target.value)} } size='small'
            />
            <TextField
              required multiline key={`${ item.id ? item.id : pItem.id }-category`}
              label="Category" value={ item.category ? item.category : pItem.category}
              onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateCategory(e.target.value)} } size='small'
            />
            <TextField
                required multiline key={`${ item.id ? item.id : pItem.id }-description`}
                label="Description" value={ item.description ? item.description : pItem.description }
                onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {updateDescription(e.target.value)} } size='small'
            />
            <TextField
              required multiline key={`${ item.id ? item.id : pItem.id }-note`}
              label="Note" value={ item.note ? item.note : pItem.note}
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
                  <Tooltip title="Add new tag">
                    <ListItemIcon onClick={ () => {} }>
                      <Add />
                    </ListItemIcon>
                  </Tooltip>
                </ListSubheader>
              }>

              <ListItemButton key={ 'tag-newtag-formField' }>
                <TextField required multiline
                    key='TextField-newTag-formField'
                    value={ newTag ? newTag : ""}
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
                tagsUsed.map((tagItem: string, id: number) => (
                  <ListItemButton key={ 'tag-' + id + '-formField' }>
                    <TextField required multiline
                        key={ 'tag-' + id + 'formField' }
                        value={ tagItem }
                        size='small'
                        onChange={
                          (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {handleTag(e, tagItem, e.target.value)}
                        }
                    />
                    <IconButton onClick={() => alert("Delete tag clicked")}>
                      <Tooltip title="Delete Tag"><Close/></Tooltip>
                    </IconButton>

                  </ListItemButton>
                ))
              }
            </List>
          </Box>
        </form>
      </Box>
    </Grid>
  );
}



// export function ItemDetailsMaterial({ item }: {
//   itemId: IProtoItem
// }): React.ReactNode {
//   const [tagCollapsed, setTagCollapsed] = useState(true);
//   const itemsKey = "itemsDetails";
//   const queryClient = useQueryClient();

//   function handleSave (event, newItem: IProtoItem){
//     event.preventDefault();
//     alert("Submit buttone is clicked");
//     // const mutation = useMutation({
//     //   mutationFn: () => postItem(traceparent, newItem),
//     //   onSuccess: () => {
//     //     queryClient.invalidateQueries({ queryKey: [itemsKey] })
//     //   },
//     // })
//   }

//   return (
//     <Grid size={{ xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
//       <Box
//           sx={{
//             width: '100%', flexGrow: 1, alignItems: 'center',
//             height: '100%', justifyContent: 'center',
//           }}>
//         {/* <Stack
//             spacing={ 2 } direction="row" key={ item.title + '-Buttons' }
//             sx={{ width: '100%', justifyContent: 'space-around',
//               dislay: 'inline-flex', p: 1,
//             }}>
//           <Button key='save' size="small" sx={{ display: "block"}}
//                   onClick={ () => {}}>
//             Save
//           </Button>
//           <Button key='delete' size="small" onClick={ () => {} }>
//               Delete
//           </Button>
//         </Stack> */}
//         <Stack
//             spacing={ 2 } direction="row" key={ item.title + '-Buttons' }
//             sx={{ width: '100%', justifyContent: 'space-around',
//                 dislay: 'inline-flex', p: 1,
//             }}>
//           <IconButton type="submit" onSubmit={handleSave}>
//             <Tooltip title="Save"><Send/></Tooltip>
//           </IconButton>
//           <IconButton onClick={ () => console.info("Delete Button clicked") }>
//             <Tooltip title="Delete"><Delete/></Tooltip>
//           </IconButton>
//         </Stack>
//         <Box
//             component="form" key={ item.title + '-Box' }
//             noValidate autoComplete="off"
//             sx={{
//               '& .MuiTextField-root': {
//                 m: 1, width: '100%', maxWidth: 640,
//               },
//               width: '100%',  p: 2, overflow: 'auto',
//               // border: 1, borderColor: 'rgba(50,50,50,0.3)',
//               // bgcolor: 'background.paper',
//               maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
//             }}
//             >
//           <Box component="div">
//               <TextField required multiline key='TextField-summary-formField'
//                 label='Summary' value={ item.summary }
//                 onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
//               />
//               <TextField
//                 required multiline key='TextField-note-formField'
//                 label="Note" value={ item.note }
//                 onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
//               />
//               <TextField
//                   required multiline key='TextField-description-formField'
//                   label="Description" value={ item.description }
//                   onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
//               />
//           </Box>
//           <List
//             sx={{ width: '100%', maxWidth: 360, }}
//             aria-labelledby="nested-list-subheader"
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader"
//                 sx={{ display: 'flex' }}>
//                 <ListItemText primary="Tags" />
//                 <Tooltip title="Add new tag">
//                   <ListItemIcon onClick={ () => {} }>
//                     <Add />
//                   </ListItemIcon>
//                 </Tooltip>
//               </ListSubheader>
//             }>
//             <TextField required multiline key='TextField-newTag-formField'
//                 label='New Tag' value={ "" }
//                 onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
//             />
//             <Collapse in={tagCollapsed} timeout="auto" >
//               <List component="div" disablePadding>
//                 {
//                   item.tags.map((tagItem: string) => (
//                     <ListItemButton key={ 'tag-' + tagItem + 'formField' }>

//                       <TextField required multiline
//                           key='TextField-newTag-formField'
//                           value={ tagItem }
//                           size='small'
//                           onChange={
//                             (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {}
//                           }
//                       />
//                       {/* <ListItemIcon>
//                         <Delete onClick={ (e: React.MouseEvent<HTMLButtonElement>) => { }} />
//                       </ListItemIcon> */}
//                       <IconButton onClick={() => alert("Delete tag clicked")}>
//                         <Tooltip title="Delete Tag"><Close/></Tooltip>
//                       </IconButton>

//                     </ListItemButton>
//                   ))
//                 }
//               </List>
//             </Collapse>
//             <Collapse in={tagCollapsed} timeout="auto" >
//               <List component="div" disablePadding>
//                 {
//                   item.tags.map((tagItem: string) => (
//                     <ListItemButton key={ 'tag-' + tagItem + 'formField' }>
//                       <ListItemIcon>
//                       <Delete onClick={ (e: React.MouseEvent<HTMLButtonElement>) => { }} />
//                       </ListItemIcon>
//                       <ListItemText primary={ tagItem } />
//                     </ListItemButton>
//                   ))
//                 }
//               </List>
//             </Collapse>
//           </List>
//         </Box>
//       </Box>
//     </Grid>
//   );
// }
