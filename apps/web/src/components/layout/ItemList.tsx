
import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';


// Internal
// import {
//   AppItemModal
// } from "@/components/layout/AppItemModal";
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import {
  ListLayout,
  ListBox,
  OuterBox,
} from "@/components/layout";
import {
} from '@/domain/entities';
import type {
  IItemListContext,
  IListContext,
} from '@/domain/entities';
import { ListItemStyling } from "@/helpers/defaults";
import {
  useListItems,
} from "@/hooks/context/items";
import {
  ListContext,
} from "@/hooks/context/lists";



export function ItemList() {
  const {
    items,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } = useListItems() as unknown as IItemListContext;
  const storeItemScroll = useAppStore((state) => state.itemScroll);
  function renderRow(itemKey: number): ReactNode {
    const item = items[itemKey]
    let tc: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + item.id}
          disablePadding
          disableGutters
          sx={ListItemStyling}
          onClick={() => listItemClick(itemKey)}>
          <ListItemButton >
            <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          </ListItemButton>
        </ListItem>
        <Divider key="divider" />
      </Fragment>
    );
  }



  const contextValue = {
    data: items,
    pagination: pagination.paging,
    isPending: isPending,
    isError: isError,
    error: error,
    scrollIndex: Math.max(0, storeItemScroll),
    pageChange: pageChange,
    pageSizeChange: pageSizeChange,
    clickRow: listItemClick,
    renderRow,
  } as unknown as IListContext;

  function Shell({ children }: { children: ReactNode }) {
    return <ListContext.Provider value={contextValue}><ListBox><OuterBox kind="item">{children} </OuterBox></ListBox></ListContext.Provider>
  }

  if (isPending) {
    return <Shell><LinearProgress /></Shell>
  }


  if (error) {
    return <Shell><Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert></Shell>
  }

  if (items.length == 0) {
    return (
      <Shell><Typography variant="body1" sx={{ textAlign: "center", p: 3 }}> No items found </Typography></Shell>
    )
  }

  if (items.length > 0) {
    return (<Shell><ListLayout /></Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
  )
}
