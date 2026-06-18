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
import {
  queryOptions,
  useQueryClient,
  useMutation,
  useSuspenseQuery,
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
// import {
//   AppTagModal
// } from "@/components/layout/AppTagModal";
// import {
//   AppFilterModal
// } from "@/components/layout/AppFilterModal";
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
  useTagListItemClick,
} from '@/hooks/services/useTags';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import type {
  ITag,
  IReadRequest,
  IReadQuery,
  ITagReadResponse,
  IFilter,
} from '@/domain/entities';
import {
  encodeState
} from '@/utils/encoders';
import {
  getRouteContext,
} from "@/utils/routing";
import {
  tagGroupOptions,
} from '@/hooks/queries';
import {
  DefaultReadQuery,
  Pagination,
} from "@/domain/entities";
import { TagFormProvider } from '@/hooks/services/useTags';



export function Tags() {
  const store: TAppStore = useAppStore((state) => state);
  const navigate = useNavigate();
  const { query, pagination, } = getRouteContext("/tags");
  // console.info('Tags', { query, pagination, })
  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useSuspenseQuery(tagGroupOptions({ query, pagination, }));
  // const {
  //   data, isPending, isFetching, isError, error
  // }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(query);
  // const {
  //   listItemClick
  // } = useTagListItemClick(query);




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


  function newTagClick() {
    store.setTagModal(true);
  }
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
    <MenuItem key="tag" onClick={newTagClick}>
      <Typography variant="body1">Create new tag </Typography>
    </MenuItem>
  </Fragment >

  return (
    <AppContainer mw="sm" menuItems={mItems}>
      {/* {
        store.tagModal &&
        <TagFormProvider>
          <AppTagModal />
        </TagFormProvider>
      } */}
      {/* {store.filterModal && <AppFilterModal />} */}
      <AppPagePaper key="tags">
        <ListLayout {...props} />
      </AppPagePaper>
    </AppContainer >
  );
}
