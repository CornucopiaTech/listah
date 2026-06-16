import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import type {
  UseSuspenseQueryResult,
} from '@tanstack/react-query';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';


// Internal
import {
  useAppStore,
  type TAppStore
} from '@/store/boundStore';
import { AppTagModal } from "@/components/layout/AppTagModal";
import { AppFilterModal } from "@/components/layout/AppFilterModal";
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  useListTag,
} from '@/queries/tag';
import {
  useTagRouteContext,
  useTagPagination,
  useTagListItemClick,
} from '@/services/useTags';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import type {
  ITagReadResponse,
} from '@/entities/tag';


export function Tags() {
  const store: TAppStore = useAppStore((state) => state);
  const {
    query,
  } = useTagRouteContext()
  const {
    pageInfo,
    pageChange,
    pageSizeChange,
    setPaginationInfo,
  } = useTagPagination(query);
  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(query);
  const {
    listItemClick
  } = useTagListItemClick(query);

  if (data) {
    setPaginationInfo(data);
  }
  function newTagClick() {
    store.setTagModal(true);
  }

  function renderItem(itemKey: number): ReactNode {
    const tags = data?.tags ?? [];
    const item = tags[itemKey];
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem
        key={itemKey + tc}
        component="div" disablePadding
        onClick={() => listItemClick(itemKey, item)}
      >
        <ListItemButton>
          <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          <Chip
            variant="contained"
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"}
            label={item.count ? item.count.toString() : "0"}
          />
        </ListItemButton>
      </ListItem>
    );
  }


  const props = {
    data: data?.tags ?? [],
    isPending, isFetching, isError, error,
    scrollIndex: Math.max(0, store.tagScroll),
    pagination: pageInfo.current,
    renderItem,
    pageSizeChange,
    pageChange,
  }
  const mItems = <Fragment>
    <MenuItem key="tag" onClick={newTagClick}>
      <Typography variant="body1">Create new tag </Typography>
    </MenuItem>
  </Fragment >
  return (
    <AppContainer mw="md" menuItems={mItems}>
      {store.tagModal && <AppTagModal />}
      {store.filterModal && <AppFilterModal />}
      <AppPagePaper key="tags">
        {/* <TagListLayout /> */}
        <ListLayout {...props} />
      </AppPagePaper>
    </AppContainer >
  );
}
