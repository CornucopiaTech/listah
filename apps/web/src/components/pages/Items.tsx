
import {
  Fragment,
  useRef,
} from "react";
import type {
  ReactNode,
} from 'react';
import {
  getRouteApi,
  useNavigate,
} from '@tanstack/react-router';
import type {
  UseSuspenseQueryResult,
} from '@tanstack/react-query';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import type {
  ChangeEvent,
  MouseEvent,
} from 'react';

// Internal
import {
  AppItemModal
} from "@/components/layout/AppItemModal";
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import {
  AppContainer,
} from '@/components/layout/AppContainer';
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
} from "@/hooks/services/useItems";
import {
  useListItem,
} from '@/hooks/queries/item';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import type {

} from "@/domain/entities";
import {
  setPaginationInfo
} from "@/domain/rules";
import {
  DefaultPagination,
} from '@/utils/defaults';
import type {
  IItem,
  IItemReadResponse,
  IItemReadRequest,
  ITag,
  IFilter,
  ITagReadResponse,
  IPagination,
} from '@/domain/entities';
import type {
  IItemRouteSearch,
} from "@/domain/entities/item";
import {
  decodeState
} from '@/utils/encoders';
import {
  encodeState
} from '@/utils/encoders';



export function Items() {
  const store: TAppStore = useAppStore((state) => state);
  const navigate = useNavigate();

  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  const routeApi = getRouteApi('/items');
  const { search } = routeApi.useRouteContext();
  const { query, title, refTag, refFilter, } = search;
  const pageHeader = store.itemTitle ? store.itemTitle : search && title ? title : "All Items";
  const urlSearch = decodeState(routeApi.useSearch().s) as unknown as IItemRouteSearch;
  const passedTag = store.displayTag || urlSearch.refTag;
  const passedFilter = store.displayFilter || urlSearch.refFilter;

  // const {
  //   query,
  //   refTag,
  //   refFilter,
  //   title,
  //   pageHeader,
  //   urlSearch,
  //   passedTag,
  //   passedFilter,
  // } = useItemRouteContext()

  // const {
  //   pageChange,
  //   pageSizeChange,
  // } = useItemPagination(query, title, refTag, refFilter);

  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<IItemReadResponse> = useListItem(query);

  let pageInfo = useRef<IPagination>({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize && query.pagination.pageSize ? query.pagination.pageSize : DefaultPagination.pageSize,
    totalRecords: 0,
    sort: "name",
  });
  if (data) {
    pageInfo.current = setPaginationInfo(
      { ...data.pagination, totalRecords: data.totalRecordCount },
      pageInfo.current
    );
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

  function getRouteSearch(qs: IItemReadRequest) {
    const s = { query: qs, title, refTag, refFilter, }
    return encodeState(s);
  }

  const pageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) => {
    event && event.stopPropagation();
    const q = { ...query, pagination: { ...query.pagination, pageNumber: value } };
    ;
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };


  const pageSizeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const q = {
      ...query,
      pagination: {
        ...query.pagination,
        pageSize: parseInt(e.target.value, 10), pageNumber: 1
      }
    };
    console.info('In Items - pageSizeChange', q.pagination.pageSize);
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };

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
