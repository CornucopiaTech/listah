import {
  useContext,
  useEffect,
  useState,
  useCallback,
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



import { useItemsStore } from '@/lib/store/items/itemsStore';
import { WebAppContext } from "@/lib/context/webappContext";


export function ItemsDrawer({tag, category}: {tag: string[], category: string[]}): ReactNode {
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

  useEffect(() => {
    setCTags(tag);
    setCCategory(category);
  }, [tag, category]);


  function handleDrawer( changeDrawerOpen: boolean) {
    setDrOpen(changeDrawerOpen);
  }

  function handleDrawerToggle(e: ChangeEvent<HTMLButtonElement>, changeDrawerOpen: boolean = !drawerOpen) {
    e.stopPropagation();
    toggleDrawer(changeDrawerOpen);
  }

  function handleCategoryCheckChange(event: SyntheticEvent<unknown>, categoryName: string) {
    event.stopPropagation();
    let newChecked: Set<string> = checkedCategory.union(new Set([categoryName]));

    if (checkedCategory.has(categoryName)) {
      // Remove category from filter
      newChecked.delete(categoryName)
    }
    updateItemsCheckedCategory(newChecked);
  }

  function handleCategoryListCheckChange(event: SyntheticEvent<unknown>, categoryName: string) {
    // event.stopPropagation();
    let newChecked: string[] = [...checkedCategoryList, categoryName];

    if (checkedCategoryList.indexOf(categoryName) !== -1) {
      // Remove category from filter
      newChecked = newChecked.filter((i) => i != categoryName)
    }
    updateItemsCheckedCategoryList(newChecked);
  }

  function handleTagCheckChange(event: SyntheticEvent<unknown>, tagName: string) {
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

  const handleApplyFilterList = useCallback(() => {

    updateItemsCategoryFilter(checkedCategory);
    updateItemsTagFilter(checkedTag);
    // updateSearchQuery(searchQuery);
    // updateItemsFromDate(filterFromDate);
    // updateItemsToDate(filterToDate);
    toggleDrawer(false)
  }, [checkedCategory, checkedTag, toggleDrawer]);

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
  const bottomMargin: number = 4;
  // console.info("checkedCategory: ", checkedCategory);
  // console.info("checkedTag: ", checkedTag);


  const DrawerList = (
    <Box sx={{ width: 360, my: '20%', height: '100%', overflow: 'auto', }}>

      <Box sx={{ maxHeight: "40%", overflow: 'auto', mb: bottomMargin }} >
        <List key="category-list"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader"
                sx={{ display: 'flex' }}>
                <ListItemText primary="Category" />
              </ListSubheader>
            }>
          <FormGroup>{category.map((item, index) => (
            <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
              <FormControlLabel
                key={item + '-checkBoxFormControlLabel'}
                control={
                  <Checkbox
                    // checked={checkedCategoryList.indexOf(item) !== -1}
                    // onChange={(e) => handleCategoryListCheckChange(e, item)}
                    onChange={(e) => handleCategoryCheckChange(e, item)}
                    checked={checkedCategory.has(item)}

                  />
                }
                label={item}
                name={item}
              />
            </ListItem>
          ))}</FormGroup>
        </List>
      </Box>

      <Divider />

      <Box sx={{ maxHeight: "40%", overflow: 'auto', mb: bottomMargin, }}>
        <List key="tag-list"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader"
                sx={{ display: 'flex' }}>
                <ListItemText primary="Tag" />
              </ListSubheader>
            }>
          {tag.map((item, index) => (
            <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
              <FormControlLabel
                key={item + '-checkBoxFormControlLabel'}
                control={
                  <Checkbox
                    checked={checkedTag.has(item)}
                    onChange={(e) => handleTagCheckChange(e, item)}
                  />
                }
                label={item}
                name={item}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />
      <Box sx={{ width: '100', justifyContent: 'space-around', }}>
        <Button onClick={handleApplyFilter}> Apply</Button>
        <Button onClick={handleApplyFilterList}> Apply List</Button>
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
}
