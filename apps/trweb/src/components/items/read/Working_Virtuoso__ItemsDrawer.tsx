import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import type {
  ReactNode,
  ChangeEvent,
  SyntheticEvent
} from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Box,
  Drawer,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
    ListSubheader,
} from '@mui/material';
import { Virtuoso } from 'react-virtuoso';


import { useItemsStore } from '@/lib/store/items/itemsStore';
import { WebAppContext } from "@/lib/context/webappContext";


export const ItemsDrawer = memo(function ItemsDrawer({tag, category}: {tag: string[], category: string[]}): ReactNode {
  const {
    checkedTag,
    checkedCategory,
    checkedTagList,
    checkedCategoryList,
    searchQuery,
    drawerOpen,
    filterFromDate,
    filterToDate,
    updateItemsCategoryFilter,
    updateItemsTagFilter,
    toggleDrawer,
    updateSearchQuery,
    updateItemsCheckedCategory,
    updateItemsCheckedTag,
    updateItemsCheckedCategoryList,
    updateItemsCheckedTagList,
    updateItemsFromDate,
    updateItemsToDate,
  } = useItemsStore((state) => state);
  const webState = useContext(WebAppContext);

  const [cTags, setCTags] = useState<string[]>([]);
  const [cCategory, setCCategory] = useState<string[]>([]);
  const [drOpen, setDrOpen] = useState<boolean>(false);


  function handleDrawer( changeDrawerOpen: boolean) {
    setDrOpen(changeDrawerOpen);
  }

  function handleDrawerToggle(e: ChangeEvent<HTMLButtonElement>, changeDrawerOpen: boolean = !drawerOpen) {
    e.stopPropagation();
    toggleDrawer(changeDrawerOpen);
  }

  function handleCategoryCheckChange(categoryName: string) {
    event.stopPropagation();
    let newChecked: Set<string> = checkedCategory.union(new Set([categoryName]));

    if (checkedCategory.has(categoryName)) {
      // Remove category from filter
      newChecked.delete(categoryName)
    }
    updateItemsCheckedCategory(newChecked);
  }


  function handleTagCheckChange(tagName: string) {
    // event.stopPropagation();
    let newChecked: Set<string> = checkedTag.union(new Set([tagName]))
    if (checkedTag.has(tagName)) {
      // Remove tag from filter
      newChecked.delete(tagName)
    }
    updateItemsCheckedTag(newChecked);
  }

  function handleApplyFilter() {
    updateItemsCategoryFilter([...checkedCategory]);
    updateItemsTagFilter([...checkedTag]);
    updateSearchQuery(searchQuery);
    updateItemsFromDate(filterFromDate);
    updateItemsToDate(filterToDate);
    toggleDrawer(false)
  }

  function handleResetFilter() {
    updateItemsCategoryFilter([]);
    updateItemsTagFilter([]);
    updateItemsCheckedCategory(new Set([]));
    updateItemsCheckedTag(new Set([]));
    updateSearchQuery("");
    updateItemsFromDate("");
    updateItemsToDate("");
    toggleDrawer(false);
  }

  const listLeftPadding: number = 3;
  const bottomMargin: number = 2;
  const topMargin: number = 1;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;

  const DrawerList = (
    <Box sx={{ width: 360, my: '10%', height: '100%', overflow: 'auto', }} role="presentation" >

      <Typography variant="body" component="div" sx={{ flexGrow: 1, textAlign: 'left', pl: textPaddingLeft , pb: textPaddingBottom }}>
        Category
      </Typography>
      < Virtuoso
        style={{ height: '40%' }}
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
                  checked={checkedCategory.has(item)}

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
        style={{ height: '40%' }}
        data={tag}
        itemContent={(_, item) => (
          <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
            <FormControlLabel
              key={item + '-checkBoxFormControlLabel'}
              control={
                <Checkbox
                  checked={checkedTag.has(item)}
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
      <Box sx={{ width: '100', justifyContent: 'space-around', }}>
        <Button onClick={handleApplyFilter}> Apply</Button>
        <Button onClick={handleResetFilter}> Reset</Button>
      </Box>
    </Box>


  );

  return (
    <div>
      <Button onClick={() => handleDrawer(true)}>Open drawer</Button>
      <Drawer open={drOpen} onClose={() => handleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
});



export function ItemDrawerVirtualized({ items }: { items: string[] }): ReactNode {
  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={items}
      itemContent={(_, item) => (
        <div
          style={{
            padding: '0.5rem',
            height: `${item.size}px`,
            borderBottom: `1px solid var(--border)`
          }}
        >
          <div>{item}</div>
        </div>
      )}
    />
  );
}
