import {
  useContext,
  useState,
  memo,
} from 'react';
import type {
  ReactNode,
  ChangeEvent,
} from 'react';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import {
  Box,
  Drawer,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Tune
} from '@mui/icons-material';
import { Virtuoso } from 'react-virtuoso';


import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';
import { WebAppContext } from "@/lib/context/webappContext";
import type { ItemProto, ItemsProto, ZItemsProto, ItemsStore } from '@/lib/model/ItemsModel';


export const ItemsDrawer = memo(function ItemsDrawer({ tag, category }: { tag: string[], category: string[] }): ReactNode {
  const itemStore: ItemsStore = useItemsStore((state) => state);

  function handleDrawerToggle(e: ChangeEvent<HTMLButtonElement>, changeDrawerOpen: boolean = !itemStore.drawerOpen) {
    e.stopPropagation();
    itemStore.toggleDrawer(changeDrawerOpen);
  }

  function handleCategoryCheckChange(categoryName: string) {
    let newChecked: Set<string> = itemStore.checkedCategory.union(new Set([categoryName]));

    if (itemStore.checkedCategory.has(categoryName)) {
      // Remove category from filter
      newChecked.delete(categoryName)
    }
    itemStore.updateItemsCheckedCategory(newChecked);
  }

  function handleTagCheckChange(tagName: string) {
    // event.stopPropagation();
    let newChecked: Set<string> = itemStore.checkedTag.union(new Set([tagName]))
    if (itemStore.checkedTag.has(tagName)) {
      // Remove tag from filter
      newChecked.delete(tagName)
    }
    itemStore.updateItemsCheckedTag(newChecked);
  }

  function handleApplyFilter() {
    itemStore.updateItemsCategoryFilter([...itemStore.checkedCategory]);
    itemStore.updateItemsTagFilter([...itemStore.checkedTag]);
    itemStore.updateSearchQuery(itemStore.searchQuery);
    itemStore.updateItemsFromDate(itemStore.fromFilterDate);
    itemStore.updateItemsToDate(itemStore.toFilterDate);
    itemStore.toggleDrawer(false)
  }

  function handleResetFilter() {
    itemStore.updateItemsCategoryFilter([]);
    itemStore.updateItemsTagFilter([]);
    itemStore.updateItemsCheckedCategory(new Set([]));
    itemStore.updateItemsCheckedTag(new Set([]));
    itemStore.updateSearchQuery("");
    itemStore.updateItemsFromDate("");
    itemStore.updateItemsToDate("");
    itemStore.toggleDrawer(false);
  }

  const listLeftPadding: number = 3;
  const bottomMargin: number = 2;
  const topMargin: number = 1;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;

  const DrawerList = (
    <Box sx={{ width: 360, my: '10%', height: '100vh', overflow: 'auto', }} role="presentation" >

      <Typography variant="body" component="div" sx={{ flexGrow: 1, textAlign: 'left', pl: textPaddingLeft, pb: textPaddingBottom }}>
        Category
      </Typography>
      < Virtuoso
        style={{ height: '35vh' }}
        data={category}
        itemContent={(_, item) => (
          <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
            <FormControlLabel
              key={item + '-checkBoxFormControlLabel'}
              control={
                <Checkbox
                  // checked={checkedCategoryList.indexOf(item) !== -1}
                  // onChange={(e) => handleCategoryListCheckChange(e, item)}
                  onChange={() => handleCategoryCheckChange(item)}
                  checked={itemStore.checkedCategory.has(item)}

                />
              }
              label={item}
              name={item}
            />
          </ListItem>
        )}
      />

      <Divider sx={{ mb: bottomMargin, mt: topMargin }} />

      <Typography variant="body" component="div" sx={{ flexGrow: 1, textAlign: 'left', pl: textPaddingLeft, pb: textPaddingBottom }}>
        Tag
      </Typography>
      < Virtuoso
        style={{ height: '35vh' }}
        data={tag}
        itemContent={(_, item) => (
          <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
            <FormControlLabel
              key={item + '-checkBoxFormControlLabel'}
              control={
                <Checkbox
                  checked={itemStore.checkedTag.has(item)}
                  onChange={() => handleTagCheckChange(item)}
                />
              }
              label={item}
              name={item}
            />
          </ListItem>
        )}
      />

      <Divider sx={{ mb: bottomMargin, mt: topMargin }} />
      <Box sx={{ display: 'flex', width: '100', justifyContent: 'space-between', }}>
        <Button onClick={handleApplyFilter}> Apply</Button>
        <Button onClick={handleResetFilter}> Reset</Button>
      </Box>
    </Box>


  );

  return (
    <div>
      <Button onClick={(e) => handleDrawerToggle(e, true)} startIcon={<Tune />}> Filter</Button>
      <Drawer open={itemStore.drawerOpen} onClose={(e) => handleDrawerToggle(e, false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
});
ItemsDrawer.displayName = 'ItemsDrawer';
