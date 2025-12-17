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
import { useAppSelector, useAppDispatch } from '@/lib/state/hook';
import { useBoundStore } from '@/lib/store/boundStore';
import { WebAppContext } from "@/lib/context/webappContext";
import type { ItemProto, ItemsProto, ZItemsProto, ItemsStore } from '@/lib/model/ItemsModel';


export const ItemsDrawer = memo(function ItemsDrawer({ tag, category }: { tag: string[], category: string[] }): ReactNode {
  const listingState = useAppSelector((state) => state.listing);
  const dispatch = useAppDispatch();

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
                  onChange={() => dispatch(listingState.setCheckedCategory(item))}
                  checked={listingState.checkedCategory.has(item)}
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
                  checked={listingState.checkedTag.has(item)}
                  onChange={() => dispatch(listingState.setCheckedTag(item))}
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
        <Button onClick={() => dispatch(listingState.applyFilter())}> Apply</Button>
        <Button onClick={() => dispatch(listingState.resetFilter())}> Reset</Button>
      </Box>
    </Box>


  );

  return (
    <div>
      <Button
          onClick={() => dispatch(listingState.setToggleDrawer(true))}
          startIcon={<Tune />}
        >
        Filter
      </Button>
      <Drawer
          open={listingState.drawerOpen}
          onClose={() => dispatch(listingState.setToggleDrawer(false))}
        > {DrawerList}
      </Drawer>
    </div>
  );
});
ItemsDrawer.displayName = 'ItemsDrawer';
