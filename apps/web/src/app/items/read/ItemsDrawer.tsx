"use client"
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
  TextField
} from '@mui/material';

import {
  ArrowDropDown,
  Tune
} from '@mui/icons-material';

import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';


export function ItemsDrawer({
  tag, categories,
}: {
  tag: string[], categories: string[],
}) {
  const {
    categoryFilter,
    tagFilter,
    checkedTags,
    checkedCategories,
    searchQuery,
    drawerOpen,
    collapseTags,
    collapseCategories,
    collapseDatePicker,
    filterFromDate,
    filterToDate,
    updateItemsCategoryFilter,
    updateItemsTagFilter,
    toggleDrawer,
    updateSearchQuery,
    updateItemsCheckedCategory,
    updateItemsCheckedTags,
    updateItemsFromDate,
    updateItemsToDate,
  } = useItemsStore((state) => state);

  // function handleDrawerToggle(e: React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES) {
  function handleDrawerToggle(e: React.ChangeEvent<HTMLButtonElement>, changeDrawerOpen: boolean = !drawerOpen) {
    e.stopPropagation();
    toggleDrawer(changeDrawerOpen);  // Toggle the drawer open state
  }

  function handleCategoryCheckChange(event: React.SyntheticEvent<unknown>, categoryName: string) {
    event.stopPropagation();
    if (!checkedCategories) {
      updateItemsCheckedCategory([categoryName]);
    } else if (checkedCategories.indexOf(categoryName) === -1) {
      updateItemsCheckedCategory([...checkedCategories, categoryName]);
    } else {
      // Remove category from filter
      const newFilter = checkedCategories.filter((item: string) => item !== categoryName);
      updateItemsCheckedCategory(newFilter);
    }
  }

  function handleTagCheckChange(event: React.SyntheticEvent<unknown>, tagName: string) {
    event.stopPropagation();
    if (!checkedTags) {
      updateItemsCheckedTags([tagName]);
    } else if (checkedTags.indexOf(tagName) === -1) {
      updateItemsCheckedTags([...checkedTags, tagName]);
    } else {
      // Remove category from filter
      const newFilter = checkedTags.filter((item: string) => item !== tagName);
      updateItemsCheckedTags(newFilter);
    }
  }

  function handleApplyFilter() {
    updateItemsCategoryFilter(checkedCategories);
    updateItemsTagFilter(checkedTags);
    updateSearchQuery(searchQuery);
    updateItemsFromDate(filterFromDate);
    updateItemsToDate(filterToDate);
  }

  function handleResetFilter() {
    updateItemsCheckedCategory([]);
    updateItemsCheckedTags([]);
    updateSearchQuery("");
    updateItemsFromDate("");
    updateItemsToDate("");
  }

  return (
    <Box sx={{ mx: 3, }}>
      <Button onClick={handleDrawerToggle} startIcon={<Tune />}>
        Filter
      </Button>

      <Drawer open={drawerOpen} onClose={(e) => handleDrawerToggle(e, false)}>
        <Box component='form' sx={{ width: 250, p: 2, my: 6 }}
          role="presentation" >
          <TextField id="standard-basic" label="Search for item" variant="standard" sx={{ mb: 4, }} />

          {/* Categories */}
          <Accordion key="category" defaultExpanded
            sx={{ mb: 4, boxShadow: 0, }}>
            <AccordionSummary
              expandIcon={<ArrowDropDown />}
              aria-controls="panel1-content"
              id="panel1-header">
              <Typography>Category</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto', }}>
              <FormGroup>{
                categories.map((item: string) => (
                  <FormControlLabel
                    key={item + '-category-checkBox'}
                    control={
                      <Checkbox
                        checked={checkedCategories.indexOf(item) != -1}
                        onChange={(e) => handleCategoryCheckChange(e, item)}
                      />
                    }
                    label={item} name={item}
                  />
                ))
              }</FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Tags */}
          <Accordion key="tag" defaultExpanded
            sx={{ mb: 4, boxShadow: 0 }}>
            <AccordionSummary
              expandIcon={<ArrowDropDown />}
              aria-controls="panel2-content"
              id="panel2-header">
              <Typography>Tags</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto', }}>
              <FormGroup>{
                tag.map((item: string) => (
                  <FormControlLabel
                    key={item + '-checkBoxFormControlLabel'}
                    control={
                      <Checkbox
                        checked={checkedTags.indexOf(item) != -1}
                        onChange={(e) => handleTagCheckChange(e, item)}
                      />
                    }
                    label={item}
                    name={item}
                  />
                ))
              }</FormGroup>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ width: '100', my: 6, justifyContent: 'space-around', }}>
            <Button onClick={handleApplyFilter}> Apply</Button>
            <Button onClick={handleResetFilter}> Reset</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
