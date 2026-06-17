import {
  Fragment,
  useRef,
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
} from '@/hooks/store/boundStore';
import {
  AppTagModal
} from "@/components/layout/AppTagModal";
import {
  AppFilterModal
} from "@/components/layout/AppFilterModal";
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  useListTag,
} from '@/hooks/queries/tag';
import {
  useTagRouteContext,
  useTagPagination,
  useTagListItemClick,
} from '@/hooks/services/useTags';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import {
  DefaultPagination,
} from '@/utils/defaults';
import type {
  IItemReadRequest,
  IItemReadResponse,
  ITag,
  IFilter,
  ITagReadResponse,
  IPagination,
} from '@/domain/entities';
import {
  setPaginationInfo
} from "@/domain/rules";


export function Tags() {
  const store: TAppStore = useAppStore((state) => state);
  const {
    query,
  } = useTagRouteContext()
  let pageInfo = useRef<IPagination>({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize && query.pagination.pageSize ? query.pagination.pageSize : DefaultPagination.pageSize,
    totalRecords: 0,
    sort: "name",
  });
  const {
    pageChange,
    pageSizeChange,
  } = useTagPagination(query);
  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(query);
  const {
    listItemClick
  } = useTagListItemClick(query);

  if (data) {
    pageInfo.current = setPaginationInfo(
      { ...data.pagination, totalRecords: data.totalRecordCount },
      pageInfo.current
    );
  }

  function newTagClick() {
    store.setTagModal(true);
  }

  function renderItem(itemKey: number): ReactNode {
    const tags = data?.tags ?? [];
    const item = tags[itemKey];
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem key={itemKey + tc} component="div" disablePadding onClick={() => listItemClick(itemKey, item)} >
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

  console.info('Before return')
  return (
    <AppContainer mw="sm" menuItems={mItems}>
      {store.tagModal && <AppTagModal />}
      {store.filterModal && <AppFilterModal />}
      <AppPagePaper key="tags">
        <ListLayout {...props} />
      </AppPagePaper>
    </AppContainer >
  );
}
