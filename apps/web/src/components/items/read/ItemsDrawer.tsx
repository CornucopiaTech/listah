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
import { Navigate, useNavigate } from '@tanstack/react-router';



// Internal store
import { encodeState } from '@/lib/utils/encoders';
import { ITEMS_URL } from '@/lib/utils/defaults';
import { useBoundStore } from '@/lib/store/boundStore';
import { WebAppContext } from "@/lib/context/webappContext";
import type { ItemProto, ItemsProto, ItemsProtoSchema, IItemsSearch } from '@/lib/model/ItemsModel';


export function ItemsDrawer({ tag, category, query }: { tag: string[], category: string[], query: IItemsSearch }): ReactNode {
  const store = useBoundStore((state) => state);
  const navigate = useNavigate();
  const listLeftPadding: number = 3;
  const bottomMargin: number = 2;
  const topMargin: number = 1;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;

  function immediate_effect_handleCategoryCheck(e, categoryName: string) {
    e.stopPropagation();
    let newChecked: string[];

    if (query.categoryFilter.indexOf(categoryName) != -1) {
      // Remove category from filter
      newChecked = query.categoryFilter.filter((i) => i != categoryName);
    } else {
      newChecked = [...query.categoryFilter, categoryName]
    }
    const q = {
      ...query,
      pageNumber: 1,
      categoryFilter: newChecked,
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);

    navigate({ to: ITEMS_URL, search: { s: encoded } });
  }

  function immediate_effect_handleTagCheck(e, tagName: string) {
    e.stopPropagation();
    let newChecked: string[];

    if (query.tagFilter.indexOf(tagName) != -1) {
      newChecked = query.tagFilter.filter((i) => i != tagName);
    } else {
      newChecked = [...query.tagFilter, tagName]
    }
    const q = {
      ...query,
      pageNumber: 1,
      tagFilter: newChecked,
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
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
    const q = {
      ...query,
      pageNumber: 1,
      categoryFilter: [...query.categoryFilter, ...store.checkedCategory],
      tagFilter: [...query.tagFilter, ...store.checkedTag]
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    store.setDrawer(false);
    store.setCheckedCategory(new Set([]));
    store.setCheckedTag(new Set([]));
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  }

  function handleResetFilter() {
    store.setCheckedCategory(new Set([]));
    store.setCheckedTag(new Set([]));
    store.setSearchQuery("");
    store.setFromDate("");
    store.setToDate("");
    store.setDrawer(false);

    const q = { ...query, pageNumber: 1, categoryFilter: [], tagFilter: []};
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
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
                  checked={
                    store.checkedCategory.has(item) ||
                    query.categoryFilter.indexOf(item) !== -1
                  }
                  // checked={query.categoryFilter.indexOf(item) !== -1}
                  onChange={(e) => handleCategoryCheck(e, item)}
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
                  checked={
                    store.checkedTag.has(item) ||
                    query.tagFilter.indexOf(item) !== -1
                  }
                  // checked={query.tagFilter.indexOf(item) !== -1}
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
};
