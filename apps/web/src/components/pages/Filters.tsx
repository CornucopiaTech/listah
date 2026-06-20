import {
  Fragment,
  useRef,
} from "react";
import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';
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
  AppTagModal,
} from "@/components/layout/AppTagModal";
import {
  AppFilterModal,
} from "@/components/layout/AppFilterModal";
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  useListFilter,
} from '@/hooks/queries/filter';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import {
} from "@/domain/rules";
import type {
  IFilter,
  IReadQuery,
  IFilterReadResponse,
} from "@/domain/entities";
import {
  DefaultReadQuery,
  Pagination,
} from "@/domain/entities";
import {
  encodeState
} from '@/utils/encoders';
import {
  getRouteContext,
} from "@/utils/routing";
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
} from '@/hooks/services/useForm';



export function Filters() {
  const store: TAppStore = useAppStore((state) => state);
  const navigate = useNavigate();
  const { query, pagination, } = getRouteContext("/filters");
  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<IFilterReadResponse> = useListFilter({ query, pagination, });

  // Pagination Details
  const initialPagination = new Pagination(pagination);
  let pageInfo = useRef<Pagination>(initialPagination);
  if (data) {
    pageInfo.current.updatePaging(data.pagination, pagination);
  }
  function pageChange(event: MouseEvent<HTMLButtonElement> | null, value: number) {
    event && event.stopPropagation();
    pageInfo.current.changePage(value);
    const encoded = encodeState({ query, pagination: pageInfo.current.paging });
    navigate({ to: ".", search: { s: encoded } });
  };
  function pageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    pageInfo.current.changeSize(e.target.value);
    const encoded = encodeState({ query, pagination: pageInfo.current.paging });
    navigate({ to: ".", search: { s: encoded } });
  };



  const listItemClick = (idx: number, it: IFilter) => {
    const pageTitle = it && it.name ? `##${it.name}` : "Filters";
    const q: IReadQuery = { ...DefaultReadQuery, userId: query.userId, tags: it.tags };
    const s = { query: q, pagination, title: pageTitle, reference: { filter: it }, }
    const encoded = encodeState(s);
    navigate({ to: "/items", search: { s: encoded }, });
    store.setItemTitle(pageTitle);
    store.setDisplayFilter(it);
    store.setFilterScroll(idx);
  }

  function renderItem(itemKey: number): ReactNode {
    const filters = data?.filters ?? [];
    const item: IFilter = filters[itemKey];
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
    data: data?.filters ?? [],
    isPending, isFetching, isError, error,
    scrollIndex: Math.max(0, store.filterScroll),
    pagination: pageInfo.current.paging,
    renderItem,
    pageSizeChange,
    pageChange,
  }
  const mItems = <Fragment>
    <MenuItem key="tag" onClick={() => store.setTagModal(true)}>
      <Typography variant="body1">Create new tag </Typography>
    </MenuItem>
    <MenuItem key="filter" onClick={() => store.setFilterModal(true)}>
      <Typography variant="body1">Create new filter </Typography>
    </MenuItem>
  </Fragment >;

  return (
    <AppContainer mw="sm" menuItems={mItems}>
      {
        store.tagModal &&
        <TagFormDataProvider>
          <TagFormProvider>
            <AppTagModal />
          </TagFormProvider>
        </TagFormDataProvider>
      }
      {
        store.filterModal &&
        <FilterFormDataProvider>
          <FilterFormProvider >
            <AppFilterModal />
          </ FilterFormProvider>
        </FilterFormDataProvider>
      }
      <AppPagePaper key="tags">
        <ListLayout {...props} />
      </AppPagePaper>
    </AppContainer >
  );
}
