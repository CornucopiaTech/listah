import { Suspense, useRef} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Await } from "react-router";
import {
  ListItem,
  Grid2 as Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


import type { AppDispatch, RootState } from '~/store';
import {
  ChooseSelectedItem,
  selectItem,
} from '~/hooks/state/itemSlice';
import { getItems } from '~/repository/fetcher';
import type { ItemModelInterface } from '~/model/items';

export function ItemListing(){
  const useAppDispatch = useDispatch.withTypes<AppDispatch>().withTypes<AppDispatch>()
  const dispatch = useAppDispatch();

  const useAppSelector = useSelector.withTypes<RootState>()
  const itemState = useAppSelector(selectItem);

  const itemsRef = useRef(null);

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  function focusItem(listItem) {
    const map = getMap();
    const node = map.get(listItem);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    node.focus();
  }

  if (itemState.selectedItem){
    focusItem(itemState.selectedItem.id);
  }

  return (
    <Grid size='grow'>
        {/* Item list grid */}
        <List sx={{
                width: '100%', p: 2,
                maxHeight: { xs: 240, sm: 240, md: 360, lg: 720, xl: 840 },
                overflow: 'auto',
                bgcolor: 'cyan',
                color: 'black',
                justifyContent: "center",
                alignItems: "flex-start",
                border: 1,
                borderColor: 'rgba(50,50,50,0.3)',
              }}>
                <Suspense fallback={<Skeleton animation="wave" />}>
                  <Await
                    resolve={getItems(itemState.categoryFilters, itemState.tagFilters, [])}
                    errorElement={
                        <Typography variant="h6" gutterBottom
                                    sx={{justifyContent: 'center', alignContent: 'center', p:4,}}>
                          Unable To Retrieve Listing of Items
                        </Typography >
                      }
                    children={ (data) => (
                      // {
                        // ToDo: Make a vertical stack where the summary contains selected columns for the category
                        // ToDo: Have a ticker button at the start of the list
                        // ToDO: Long press should bring a menu with quick options for editing an item (for example. removing it temporarily)
                        data.items.map((listItem: ItemModelInterface) => (
                          <ListItem
                              key={listItem.id}
                              variant="outlined"
                              onClick={() => {
                                dispatch(ChooseSelectedItem(listItem))
                              }}
                              size='large'
                              ref={(node) => {
                                const map = getMap();
                                map.set(listItem.id, node);

                                return () => {
                                  map.delete(listItem);
                                };
                              }}>
                            <ListItemButton>
                              {
                                itemState.selectedItem &&
                                listItem.id == itemState.selectedItem.id &&
                                <ListItemIcon><ExpandLessIcon /></ListItemIcon>
                              }
                              <ListItemText primary={listItem.summary} />
                            </ListItemButton>
                          </ListItem>
                        ))
                      // }
                    )}
                  />
              </Suspense>
        </List>
    </Grid>
  );
}
