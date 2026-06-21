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
  AppTagModal
} from "@/components/layout/AppTagModal";
import {
  AppFilterModal
} from "@/components/layout/AppFilterModal";
import { AppContainer } from '@/components/layout/AppContainer';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  useListTag,
} from '@/hooks/queries/tag';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import type {
  ITag,
  IReadQuery,
  ITagReadResponse,
} from '@/domain/entities';
import {
  encodeState
} from '@/utils/encoders';
import {
  getRouteContext,
} from "@/utils/routing";
import {
  DefaultReadQuery,
  Pagination,
} from "@/domain/entities";
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
} from '@/hooks/services/useForm';



export function Tags() {
  const store: TAppStore = useAppStore((state) => state);
  const navigate = useNavigate();
  const { query, pagination, } = getRouteContext("/tags");
  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useListTag({ query, pagination, });

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

  const listItemClick = (idx: number, it: ITag) => {
    const pageTitle = it && it.name ? `#${it.name}` : "Tags";
    const q: IReadQuery = { ...DefaultReadQuery, userId: query.userId, tags: [it.id] };
    const s = { query: q, pagination, title: pageTitle, reference: { tag: it }, }
    const encoded = encodeState(s);

    navigate({ to: "/items", search: { s: encoded }, });
    store.setItemTitle(pageTitle);
    store.setDisplayTag(it);
    store.setTagScroll(idx);
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
  </Fragment >

  return (
    <AppContainer mw="md" menuItems={mItems} title="Tags" displayPage={true}>
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
      <ListLayout {...props} />
    </AppContainer >
  );
}
