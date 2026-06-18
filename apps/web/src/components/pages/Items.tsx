
import {
  Fragment,
  useRef,
} from "react";
import type {
  ReactNode,
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
  useListItem,
} from '@/hooks/queries/item';
import {
  ListLayout
} from '@/components/layout/ListLayout';
import type {

} from "@/domain/entities";
import {
  DefaultItem,
  Pagination,
} from '@/domain/entities';
import type {
  IItem,
  IItemReadResponse,
  IReadRequest,
  ITag,
  IFilter,
  ITagReadResponse,
  IPagination,
} from '@/domain/entities';
import {
  encodeState
} from '@/utils/encoders';
import {
  getRouteContext,
} from "@/utils/routing";
import { TagFormProvider } from '@/hooks/services/useTags';



export function Items() {
  const store: TAppStore = useAppStore((state) => state);
  const navigate = useNavigate();
  const { query, pagination, reference, title } = getRouteContext("/items");
  // ToDo: The actions below should be in the getRouteContext function
  const pageHeader = store.itemTitle ? store.itemTitle : title ? title : "All Items";
  const passedTag = store.displayTag || reference.tag;
  const passedFilter = store.displayFilter || reference.filter;
  const {
    data, isPending, isFetching, isError, error
  }: UseSuspenseQueryResult<IItemReadResponse> = useListItem({ query, pagination, });



  // Pagination Details
  const initialPagination = new Pagination(pagination);
  let pageInfo = useRef<Pagination>(initialPagination);
  if (data) {
    pageInfo.current.updatePaging(data.pagination, pagination);
  }
  function pageChange(event: MouseEvent<HTMLButtonElement> | null, value: number) {
    event && event.stopPropagation();
    pageInfo.current.changePage(value);
    const encoded = encodeState({ query, title, reference, pagination: pageInfo.current.paging });
    navigate({ to: ".", search: { s: encoded } });
  };
  function pageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    pageInfo.current.changeSize(e.target.value);
    const encoded = encodeState({ query, title, reference, pagination: pageInfo.current.paging });
    navigate({ to: ".", search: { s: encoded } });
  };


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
    pagination: pageInfo.current.paging,
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
        (store.displayFilter || reference?.filter) &&
        <MenuItem key="filter" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update filter</Typography>
        </MenuItem>
      }
      {
        (store.displayTag || reference?.tag) &&
        <MenuItem key="tag" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update tag </Typography>
        </MenuItem>
      }
    </Fragment >
  );

  return (
    <AppContainer mw="md" menuItems={mItems} title={pageHeader}>
      {store.itemModal && <AppItemModal passedPropTag={passedTag} passedPropFilter={passedFilter} />}
      {
        store.tagModal &&
        <TagFormProvider displayTag={passedTag}>
          <AppTagModal />
        </TagFormProvider>
      }
      {/* {store.tagModal && <AppTagModal itemTag={passedTag} />} */}
      {/* {store.filterModal && <AppFilterModal itemFilter={passedFilter} />} */}
      <AppPagePaper>
        <ListLayout {...props} />
      </AppPagePaper>
    </AppContainer>
  );
}
