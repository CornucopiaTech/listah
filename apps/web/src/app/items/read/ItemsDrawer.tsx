"use client"
import {
  Fragment,
  ReactNode,
  useContext,
} from 'react';
import {
  useQueries,
  type UseQueryResult,
} from '@tanstack/react-query';
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
import {
  getTagGroupOptions,
  getCategoryGroupOptions
} from '@/lib/utils/itemHelper';
import { WebAppContext } from "@/lib/context/webappContext";
import Loading from '@/components/Loading';
import { ErrorAlerts } from '@/components/ErrorAlert';

export function ItemsDrawer(): ReactNode {
  const {
    checkedTag,
    checkedCategory,
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
    updateItemsFromDate,
    updateItemsToDate,
  } = useItemsStore((state) => state);
  const webState = useContext(WebAppContext);
  const userId: string = webState.userId;

  // function handleDrawerToggle(e: React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES) {
  function handleDrawerToggle(e: React.ChangeEvent<HTMLButtonElement>, changeDrawerOpen: boolean = !drawerOpen) {
    e.stopPropagation();
    toggleDrawer(changeDrawerOpen);
  }

  function handleCategoryCheckChange(event: React.SyntheticEvent<unknown>, categoryName: string) {
    event.stopPropagation();
    let newChecked: Set<string> = new Set([]);

    if (!checkedCategory || checkedCategory.size == 0) {
      // Add category to new checked Set
      newChecked.add(categoryName);
    } else if (!checkedCategory.has(categoryName)) {
      // Add category to existing checked Set
      newChecked = newChecked.union(checkedCategory).add(categoryName)
    } else {
      // Remove category from existing checked Set
      newChecked = newChecked.union(checkedCategory).delete(categoryName)
    }
    updateItemsCheckedCategory(newChecked);
  }

  function handleTagCheckChange(event: React.SyntheticEvent<unknown>, tagName: string) {
    event.stopPropagation();
    let newChecked: Set<string> = new Set([]);
    if (!checkedTag || checkedTag.size == 0) {
      newChecked.add(tagName);
    } else if (!checkedTag.has(tagName)) {
      newChecked = newChecked.union(checkedTag).add(tagName)
    } else {
      // Remove category from filter
      newChecked = newChecked.union(checkedTag).delete(tagName)
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

  const { isPending, isError, data, error}: UseQueryResult<any> = useQueries(
  {
      queries: [
        getTagGroupOptions(userId),
        getCategoryGroupOptions(userId)
      ],
      combine: (results) => {
        return {
          data: results.map((res) => res.data),
          isPending: results.some((res) => res.isPending),
          isError: results.some((res) => res.isError),
          error: results.some((res) => res.error),
        }
      }
    }
  );

  if (isPending) { return <Loading />; }
  // ToDo: Fix this error message
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  const [tagResult, categoryResult] = data;
  const tag: string[] = tagResult && tagResult.tag ? tagResult.tag : []
  const category: string[] = categoryResult && categoryResult.category ? categoryResult.category : []

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
                category.map((item: string) => (
                  <FormControlLabel
                    key={item + '-category-checkBox'}
                    control={
                      <Checkbox
                        checked={checkedCategory.has(item)}
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
                        checked={checkedTag.has(item)}
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
