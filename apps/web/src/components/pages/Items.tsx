
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


// Internal
import {
  AppItemModal
} from "@/components/layout/AppItemModal";
import {
  useAppStore,
  type TAppStore
} from '@/store/boundStore';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import {
  AppTagModal
} from "@/components/layout/AppTagModal";
import {
  AppFilterModal
} from "@/components/layout/AppFilterModal";
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  DefaultItem,
} from "@/utils/defaults";
import {
  useItemRouteContext,
  useItemPagination,
} from "@/services/useItems";
import {
  useListItem,
} from '@/queries/item';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import type {
  IItem,
  IItemReadResponse,
} from "@/entities/item";



export function Items() {
  const store: TAppStore = useAppStore((state) => state);

  const {
    query,
    reference,
    title,
    pageHeader,
    urlSearch,
    passedTag,
    passedFilter,
  } = useItemRouteContext()

  const {
    pageInfo,
    pageChange,
    pageSizeChange,
    setPaginationInfo,
  } = useItemPagination(query, title, reference);

  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<IItemReadResponse> = useListItem(query);

  if (data) {
    setPaginationInfo(data);
  }

  function newItemClick() {
    let newTags: string[] = []
    if (passedTag) {
      newTags = [...newTags, passedTag.id]
    }
    if (passedFilter) {
      newTags = [...newTags, ...passedFilter.tags]
    }
    store.setDisplayItem({ ...DefaultItem, tags: newTags, });
    store.setItemModal(true);
  }

  function updateTagFilterClick() {
    if (passedTag) {
      store.setTagModal(true);
    } else if (passedFilter) {
      store.setFilterModal(true);
    }
  }

  function listItemClick(idx: number, anitem: IItem) {
    store.setDisplayItem(anitem);
    store.setItemModal(true);
    store.setItemScroll(idx);
  }

  function renderItem(itemKey: number): ReactNode {
    const items = data?.items ?? [];
    const item = items[itemKey]
    let tc: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + item.id}
          disablePadding
          disableGutters
          onClick={() => listItemClick(itemKey, item)}>
          <ListItemButton >
            <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          </ListItemButton>
        </ListItem>
      </Fragment>
    );
  }

  const props = {
    data: data?.items ?? [],
    isPending, isFetching, isError, error,
    scrollIndex: Math.max(0, store.itemScroll),
    pagination: pageInfo.current,
    renderItem,
    pageSizeChange,
    pageChange,
  }
  const mItems = (
    <Fragment>
      <MenuItem key="tag" onClick={newItemClick}>
        <Typography variant="body1">Add new item </Typography>
      </MenuItem>
      {
        (store.displayFilter || urlSearch?.refFilter) &&
        <MenuItem key="filter" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update filter</Typography>
        </MenuItem>
      }
      {
        (store.displayTag || urlSearch?.refTag) &&
        <MenuItem key="tag" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update tag </Typography>
        </MenuItem>
      }
    </Fragment >
  );

  return (
    <AppContainer mw="md" menuItems={mItems} title={pageHeader}>
      {store.itemModal && <AppItemModal passedPropTag={passedTag} passedPropFilter={passedFilter} />}
      {store.tagModal && <AppTagModal itemTag={passedTag} />}
      {store.filterModal && <AppFilterModal itemFilter={passedFilter} />}
      <AppPagePaper>
        <ListLayout {...props} />
      </AppPagePaper>
    </AppContainer>
  );
}
