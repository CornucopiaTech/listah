
import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';



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
  ListLayout,
  ListBox,
  OuterBox,
} from "@/components/layout";
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  DefaultItem,
} from '@/domain/entities';
import type {
  IItemListContext,
  IListContext,
} from '@/domain/entities';
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
  ItemFormDataProvider,
  ItemFormProvider,
} from '@/hooks/services/useForm';
import { ListItemStyling } from "@/helpers/defaults";
import {
  useListItems
} from "@/hooks/context/items";
import {
  ListContext,
} from "@/hooks/context/lists";



export function ItemShell({ children }: { children: ReactNode }) {
  const {
    passedTag,
    passedFilter,
    title,
    items,
    pagination,
    isPending,
    isFetching,
    isError,
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
  const storeItemTitle = useAppStore((state) => state.itemTitle);
  const storeDisplayTag = useAppStore((state) => state.displayTag);
  const storeDisplayFilter = useAppStore((state) => state.displayFilter);
  const storeSetDisplayItem = useAppStore((state) => state.setDisplayItem);
  const storeSetItemModal = useAppStore((state) => state.setItemModal);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const storeItemScroll = useAppStore((state) => state.itemScroll);
  const storeItemModal = useAppStore((state) => state.itemModal);




  function renderRow(itemKey: number): ReactNode {
    const item = items[itemKey]
    let tc: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + item.id}
          disablePadding
          disableGutters
          sx={ListItemStyling}
          onClick={() => listItemClick(itemKey)}>
          <ListItemButton >
            <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          </ListItemButton>
        </ListItem>
      </Fragment>
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


  const menuItems = (
    <Fragment>
      <MenuItem key="tag" onClick={newItemClick}>
        <Typography variant="body1">Add new item </Typography>
      </MenuItem>
      {
        (passedFilter) &&
        <MenuItem key="filter" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update filter</Typography>
        </MenuItem>
      }
      {
        (passedTag) &&
        <MenuItem key="tag" onClick={updateTagFilterClick}>
          <Typography variant="body1">Update tag </Typography>
        </MenuItem>
      }
    </Fragment >
  );



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


  return (
    <AppContainer mw="md" >
      <AppListHeader title={title} menuItems={menuItems} />
      {
        storeItemModal &&
        <ItemFormDataProvider displayTag={passedTag} displayFilter={passedFilter}>
          <ItemFormProvider>
            <AppItemModal />
          </ItemFormProvider>
        </ItemFormDataProvider>
      }
      {/* {
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

      } */}
      <ListContext.Provider value={contextValue}>
        <ListBox><OuterBox>{children}  </OuterBox></ListBox>
      </ListContext.Provider>
    </AppContainer >
  );
}


export function Items() {
  const {
    items,
    isPending,
    error,
  } = useListItems() as unknown as IItemListContext;

  if (isPending) {
    return <LinearProgress />
  }


  if (error) {
    return <Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert>
  }
  if (items.length == 0) {
    return (
      <Typography variant="h6"> No items found </Typography>
    )
  }

  if (items.length > 0) {
    return (<ListLayout />)
  }
  return (
    <Alert severity="error">"An error occurred. Please try again"</Alert>
  )
}
