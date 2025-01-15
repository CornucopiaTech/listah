import { useDispatch, useSelector } from 'react-redux';
import {
  ListItem,
  Grid2 as Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


import type { AppDispatch, RootState } from '~/store';
import {
  ChooseSelectedItem,
  selectItem,
} from '~/hooks/state/itemSlice';
import { getItems } from '~/repository/fetcher';
import type { ItemStateInterface } from '~/model/items';


export function ItemListing(){

  const useAppDispatch = useDispatch.withTypes<AppDispatch>().withTypes<AppDispatch>()
  const dispatch = useAppDispatch();

  const useAppSelector = useSelector.withTypes<RootState>()
  const itemState = useAppSelector(selectItem);
  const data = getItems([], [], "");

  return (
    <Grid size='grow'>
      {/* Item list grid */}
      <List sx={{
            width: '100%', p: 2,
            maxHeight: { xs: 240, sm: 240, md: 360, lg: 720, xl: 840 },
            overflow: 'auto',
            bgcolor: 'cyan',
            justifyContent: "center",
            alignItems: "flex-start",
            border: 1,
            borderColor: 'rgba(50,50,50,0.3)',
          }}>
        {
          // ToDo: Make a vertical stack where the summary contains selected columns for the category
          // ToDo: Have a ticker button at the start of the list
          // ToDO: Long press should bring a menu with quick options for editing an item (for example. removing it temporarily)
          data.map((listItem: ItemStateInterface) => (
            <ListItem
              key={listItem.id}
              variant="outlined"
              onClick={() => dispatch(ChooseSelectedItem(listItem))}
              size='large'>
              <ListItemButton>
                {
                  itemState.selectedItem &&
                  listItem.id == itemState.selectedItem.id &&
                  <ListItemIcon><ExpandLessIcon /></ListItemIcon>
                }
                <ListItemText primary={listItem.title} />
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>
    </Grid>
  );
}
