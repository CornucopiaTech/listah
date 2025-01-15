
import { useDispatch, useSelector} from 'react-redux'
import {
  Fragment
} from 'react';
import {
  Box,
  Stack,
  Button,
  ListSubheader,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Grid2 as Grid,
  TextField,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


import type { AppDispatch, RootState } from '~/store';
import {
  selectItem,
  AddFilter, //Add logic to take care of removing or adding filters.
  ChangeEditStatus,
  ChangeSelectedItemDescription,
  ChangeSelectedItemNote,
  ChangeSelectedItemSummary,
  ChangeSelectedItemTags,
  ChangeSelectedItemTitle,
  ChooseSelectedItem,
  CloseFilterDrawer,
  CreateSelectedItemNewTag,
  DeleteSelectedItemTag,
  OpenFilterDrawer,
  ResetFilter,
  SaveUpdatedItem,
  ToggleCollapseTags,
  ToggleFilterDrawer,
} from '~/hooks/state/itemSlice';
import {
  saveUpdatesToItem,
} from 'app/repository/fetcher';


export function ItemDetails(){
  const useAppDispatch = useDispatch.withTypes<AppDispatch>();
  const dispatch = useAppDispatch();

  const useAppSelector = useSelector.withTypes<RootState>();
  const itemState = useAppSelector(selectItem);

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>){
    alert('Delete Button Clicked');
  }

  return (
    <Fragment>
      {
        // Component for viewing selected item.
        // This renders only if an item has been selected and the selected item was not filtered out by the most recent filter.

        itemState.selectedItem &&
        // data.filter((item: ItemModel) => item.id == itemState.selectedItem.id).length != 0 &&
        <Grid size={{ xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
          <Box sx={{
                    // border: 1,
                    bgcolor: 'pink',
                    width: '100%',
                    flexGrow: 1,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
            <Stack  spacing={2} direction="row"
                    key='state-change-buttons-Buttons'
                    sx={{
                        width: '100%', justifyContent: 'space-around',
                        bgcolor: 'purple', dislay: 'inline-flex', p: 1,
                      }}>
              <Tooltip title="Edit item">
                <Button key='edit' size="small"
                        sx={{ display: itemState.editStatus == 'viewing' ? 'block' : 'none' }}
                        onClick={() => dispatch(ChangeEditStatus("editing"))}>
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Save item">
                <Button key='save' size="small"
                        sx={{ display: itemState.editStatus == 'editing' ? 'block' : 'none' }}
                        onClick={() => {
                            dispatch(SaveUpdatedItem());
                            saveUpdatesToItem(itemState.selectedItem);
                            // ToDo: Make thunk that allows for saving the selected item before displaying the newly updated selected item.
                          }}>
                  Save
                </Button>
              </Tooltip>
              <Tooltip title="Delete item">
                <Button key='delete'
                        size="small" onClick={handleDelete}>
                  Delete
                </Button>
              </Tooltip>
            </Stack>
            <Box    component="form"
                    key='selected-item-details-Box'
                    sx={{
                            '& .MuiTextField-root': {
                              m: 1, width: '100%', maxWidth: 640,
                            },
                            width: '100%', border: 1, p: 2,
                            borderColor: 'rgba(50,50,50,0.3)',
                            bgcolor: 'background.paper',
                            maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
                            overflow: 'auto',
                        }}
                    noValidate
                    autoComplete="off">
              {/* ToDo: Fix updating item attributes. */}
              {
                // Add item note for editing mode
                itemState.editStatus === 'editing' &&
                <Box component="div">
                  <TextField
                      required
                      multiline
                      key={itemState.selectedItem.id + '-summary-TextField'}
                      label="Summary"
                      value={ itemState.selectedItem.summary }
                      onChange={ (e) => {dispatch(ChangeSelectedItemSummary(e.target.value))} }
                      size='small'
                  />
                  <TextField
                      required
                      multiline
                      key={itemState.selectedItem.id + '-note-TextField'}
                      label="Note"
                      value={ itemState.selectedItem.note }
                      onChange={ (e) => dispatch(ChangeSelectedItemNote(e.target.value)) }
                      size='small'
                  />
                  <TextField
                      required
                      multiline
                      key={itemState.selectedItem.id + '-description-TextField'}
                      label="Description"
                      value={ itemState.selectedItem.description }
                      onChange={ (e) => dispatch(ChangeSelectedItemDescription(e.target.value)) }
                      size='small'
                  />
                </Box>
              }
              {
                // Add item note for non-editing mode
                itemState.editStatus !== 'editing' &&
                <Fragment>
                  <TextField
                      disabled
                      required
                      multiline
                      key={itemState.selectedItem.id + '-summary-TextField'}
                      label="Summary"
                      value={ itemState.selectedItem.summary }
                      size='small'
                  />
                  <TextField
                      disabled
                      required
                      multiline
                      key={itemState.selectedItem.id + '-note-TextField'}
                      label="Note"
                      value={ itemState.selectedItem.note }
                      size='small'
                  />
                  <TextField
                      disabled
                      required
                      multiline
                      key={itemState.selectedItem.id + '-description-TextField'}
                      label="Description"
                      value={ itemState.selectedItem.description }
                      size='small'
                  />
                </Fragment>
              }
              <List
                      // Add List for tags field.
                      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <ListSubheader component="div" id="nested-list-subheader"
                            sx={{ display: 'flex' }}>
                            <ListItemText primary="Tags" />
                            <Tooltip title="Add new tag">
                                <ListItemIcon onClick={() => dispatch(ChangeEditStatus("editing"))}>
                                    <AddIcon />
                                </ListItemIcon>
                            </Tooltip>
                        </ListSubheader>
                      }>
                {
                  itemState.editStatus == 'editing' &&
                  <TextField
                      required
                      multiline
                      key={itemState.selectedItem.id + '-newTag-TextField'}
                      label='New Tag'
                      value={itemState.newTag}
                      onChange={(e) => dispatch(CreateSelectedItemNewTag(e.target.value))}
                      size='small'
                  />
                }
                <List component="div" disablePadding>
                  {
                    itemState.selectedItem.tags.map((tagItem: string) => (
                      <ListItemButton key={'tag-' + tagItem + 'formField'}>
                        <ListItemIcon>
                          {
                            itemState.editStatus == 'editing' &&
                            // ToDO: Fix delete button function.
                            <DeleteIcon onClick={() => dispatch(DeleteSelectedItemTag(tagItem))} />
                          }
                        </ListItemIcon>
                        <ListItemText primary={tagItem} />
                      </ListItemButton>
                    ))
                  }
                </List>
              </List>
            </Box>
          </Box>
        </Grid>
      }
    </Fragment>
  );
}
