
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
  useQueryResult,
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
  AppTagModal,
  AppFilterModal,
  ListLayout
} from "@/components/layout";
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  useListItem,
} from '@/hooks/queries/item';
import {

} from '@/components/layout/ListLayout';
import {
  DefaultItem,
  Pagination,
} from '@/domain/entities';
import type {
  IItem,
  IItemReadResponse,
  IItemListContext,
  IListContext,
} from '@/domain/entities';
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
  ItemFormDataProvider,
  ItemFormProvider,
} from '@/hooks/services/useForm';
import { ListItemStyling } from "@/utils/defaults";
import {
  useListItems
} from "@/hooks/context/items";
import {
  ListContext,
} from "@/hooks/context/lists";



export function ItemShell({ children }: { children: ReactNode }) {
  const {
    items,
    pagination,
    isPending,
    isError,
    isFetching,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } = useListItems() as unknown as IItemListContext;
  const storeTagScroll = useAppStore((state) => state.tagScroll);
  const storeTagModal = useAppStore((state) => state.tagModal);
  const storeFilterModal = useAppStore((state) => state.filterModal);

  const storeSetTagModal = useAppStore((state) => state.setTagModal);
  const storeSetFilterModal = useAppStore((state) => state.setFilterModal);


  function renderRow(itemKey: number): ReactNode {
    const item = items[itemKey];
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem key={itemKey + tc} component="div" disablePadding sx={ListItemStyling} onClick={() => listItemClick(itemKey)} >
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

  const contextValue = {
    data: items,
    pagination: pagination.paging,
    isPending,
    isError,
    isFetching,
    error,
    scrollIndex: Math.max(0, storeTagScroll),
    pageChange,
    pageSizeChange,
    clickRow: listItemClick,
    renderRow,
  } as unknown as IListContext;

  const mItems = <Fragment>
    <MenuItem key="tag" onClick={() => storeSetTagModal(true)}>
      <Typography variant="body1">Create new tag </Typography>
    </MenuItem>
    <MenuItem key="filter" onClick={() => storeSetFilterModal(true)}>
      <Typography variant="body1">Create new filter </Typography>
    </MenuItem>
  </Fragment >


  return (
    <AppContainer mw="md" >
      <AppListHeader title="Tags" menuItems={mItems} />
      {
        storeTagModal &&
        <TagFormDataProvider>
          <TagFormProvider>
            <AppTagModal />
          </TagFormProvider>
        </TagFormDataProvider>
      }
      {
        storeFilterModal &&
        <FilterFormDataProvider>
          <FilterFormProvider >
            <AppFilterModal />
          </ FilterFormProvider>
        </FilterFormDataProvider>
      }
      <ListContext.Provider value={contextValue}>
        <ListBox><OuterBox>{children}  </OuterBox></ListBox>
      </ListContext.Provider>
    </AppContainer >
  );
}


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
  }: useQueryResult<IItemReadResponse> = useListItem({ query, pagination, });



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
