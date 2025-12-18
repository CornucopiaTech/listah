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



// Internal store
import { useBoundStore } from '@/lib/store/boundStore';
import { WebAppContext } from "@/lib/context/webappContext";
import type { ItemProto, ItemsProto, ZItemsProto, ItemsStore } from '@/lib/model/ItemsModel';


export const ItemsDrawer = memo(function ItemsDrawer({ tag, category }: { tag: string[], category: string[] }): ReactNode {
  const store = useBoundStore((state) => state);
  const listLeftPadding: number = 3;
  const bottomMargin: number = 2;
  const topMargin: number = 1;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;


  function handleDrawerToggle(e: ChangeEvent<HTMLButtonElement>, changeDrawerOpen: boolean = !drawerOpen) {
    store.setDrawer(changeDrawerOpen);
  }

  function handleCategoryCheck(e, categoryName: string) {
    e.stopPropagation();
    let newChecked: Set<string> = store.checkedCategory.union(new Set([categoryName]));

    if (store.checkedCategory.has(categoryName)) {
      // Remove category from filter
      newChecked.delete(categoryName)
    }
    store.setCheckedCategory(newChecked);
  }

  function handleTagCheck(e, tagName: string) {
    e.stopPropagation();
    let newChecked: Set<string> = store.checkedTag.union(new Set([tagName]))
    if (store.checkedTag.has(tagName)) {
      // Remove tag from filter
      newChecked.delete(tagName)
    }
    store.setCheckedTag(newChecked);
  }

  function handleApplyFilter() {
    store.setCategoryFilter([...store.checkedCategory]);
    store.setTagFilter([...store.checkedTag]);
    store.setDrawer(false)
  }

  function handleResetFilter() {
    store.setCategoryFilter([]);
    store.setTagFilter([]);
    store.setCheckedCategory(new Set([]));
    store.setCheckedTag(new Set([]));
    store.setSearchQuery("");
    store.setFromDate("");
    store.setToDate("");
    store.setDrawer(false);
  }



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
                  onChange={(e) => handleCategoryCheck(e, item)}
                  checked={store.checkedCategory.has(item)}
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
                  checked={store.checkedTag.has(item)}
                  onChange={(e) => handleTagCheck(e, item)}
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
      <Button
          onClick={() => store.setDrawer(true)}
          startIcon={<Tune />}
        >
        Filter
      </Button>
      <Drawer
          open={store.drawer}
          onClose={() => store.setDrawer(false)}
        > {DrawerList}
      </Drawer>
    </div>
  );
});
ItemsDrawer.displayName = 'ItemsDrawer';
