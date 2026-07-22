
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
  UseQueryResult,
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
} from '@/hooks/store/boundStore';
import {
  AppContainer,
  AppListHeader,
} from '@/components/layout/AppContainer';
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
import {
  DefaultItem,
  Pagination,
} from '@/domain/entities';
import type {
  IItem,
  IItemReadResponse,
} from '@/domain/entities';
import {
  encodeState
} from '@/helpers/encoders';
import {
  getRouteContext,
} from "@/helpers/routing";
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
  ItemFormDataProvider,
  ItemFormProvider,
} from '@/hooks/services/useForm';


export function Items() {
  // const store: TAppStore = useAppStore((state) => state);
  const storeItemTitle = useAppStore((state) => state.itemTitle);
  const storeDisplayTag = useAppStore((state) => state.displayTag);
  const storeDisplayFilter = useAppStore((state) => state.displayFilter);
  const storeSetDisplayItem = useAppStore((state) => state.setDisplayItem);
  const storeSetItemModal = useAppStore((state) => state.setItemModal);
  const storeSetTagModal = useAppStore((state) => state.setTagModal);
  const storeSetFilterModal = useAppStore((state) => state.setFilterModal);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const storeItemScroll = useAppStore((state) => state.itemScroll);
  const storeItemModal = useAppStore((state) => state.itemModal);
  const storeFilterModal = useAppStore((state) => state.filterModal);
  const storeTagModal = useAppStore((state) => state.tagModal);


  const navigate = useNavigate();
  const { query, pagination, reference, title } = getRouteContext("/items");
  // ToDo: The actions below should be in the getRouteContext function
  const pageHeader = storeItemTitle ? storeItemTitle : title ? title : "All Items";
  const passedTag = storeDisplayTag || reference?.tag;
  const passedFilter = storeDisplayFilter || reference?.filter;
  const {
    data, isPending, isFetching, isError, error
  }: UseQueryResult<IItemReadResponse> = useListItem({ query, pagination, });



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
    storeSetDisplayItem({ ...DefaultItem, tags: newTags, });
    storeSetItemModal(true);
  }

  function updateTagFilterClick() {
    if (passedTag) {
      storeSetTagModal(true);
    } else if (passedFilter) {
      storeSetFilterModal(true);
    }
  }

  function listItemClick(idx: number, anitem: IItem) {
    storeSetDisplayItem(anitem);
    storeSetItemModal(true);
    storeSetItemScroll(idx);
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
    scrollIndex: Math.max(0, storeItemScroll),
    pagination: pageInfo.current.paging,
    renderItem,
    pageSizeChange,
    pageChange,
  }
  const menuItems = (
    <Fragment>
      <MenuItem key="tag" onClick={newItemClick}>
        <Typography variant="body1">Add new item </Typography>
      </MenuItem>
      {
        (storeDisplayFilter || reference?.filter) &&
        <MenuItem key="filter" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update filter</Typography>
        </MenuItem>
      }
      {
        (storeDisplayTag || reference?.tag) &&
        <MenuItem key="tag" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update tag </Typography>
        </MenuItem>
      }
    </Fragment >
  );

  return (
    <AppContainer mw="md">
      <AppListHeader title={pageHeader} menuItems={menuItems} />
      {
        storeItemModal &&
        <ItemFormDataProvider displayTag={passedTag} displayFilter={passedFilter}>
          <ItemFormProvider>
            <AppItemModal />
          </ItemFormProvider>
        </ItemFormDataProvider>

      }
      {
        storeTagModal &&
        <TagFormDataProvider displayTag={passedTag}>
          <TagFormProvider>
            <AppTagModal />
          </TagFormProvider>
        </TagFormDataProvider>
      }
      {
        storeFilterModal &&
        <FilterFormDataProvider displayFilter={passedFilter}>
          <FilterFormProvider >
            <AppFilterModal />
          </ FilterFormProvider>
        </FilterFormDataProvider>

      }
      <ListLayout {...props} />
    </AppContainer>
  );
}
