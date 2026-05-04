
import { Fragment } from "react";
import {
  getRouteApi,
} from '@tanstack/react-router';



import { AppItemModal } from "@/components/core/AppItemModal";
import { ItemListLayout } from "@/components/layout/ItemList";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppTagModal } from "@/components/core/AppTagModal";
import { AppFilterModal } from "@/components/core/AppFilterModal";
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  DefaultItem,
} from "@/lib/helper/defaults";
import type {
  IItemRouteSearch,
} from "@/lib/model/item";
import {
  decodeState,
} from '@/lib/helper/encoders';
import {
  AppListItemTypography,
} from "@/components/core/Typography";



export function Items() {
  const store: TBoundStore = useBoundStore((state) => state);
  const isTag = store.displayTag !== undefined;
  const isFilter = store.displayFilter !== undefined;
  const routeApi = getRouteApi('/items/');
  const routeSearch: { s: string } = routeApi.useSearch();
  let search: IItemRouteSearch = decodeState(routeSearch.s) as IItemRouteSearch;
  const pageHeader = store.itemTitle ? store.itemTitle : search && search.title ? search.title : "All Items";


  function handleItemClick() {
    let newTags: string[] = []
    if (store.displayTag) {
      newTags = [...newTags, store.displayTag.id]
    }
    if (store.displayFilter) {
      newTags = [...newTags, ...store.displayFilter.tags]
    }
    store.setDisplayItem({ ...DefaultItem, tags: newTags, });
    store.setItemModal(true);
  }


  function handleCategoryClick() {
    if (isTag) {
      store.setTagModal(true);
    } else if (isFilter) {
      store.setFilterModal(true);
      // ToDo: Update Filter Modal to be able to create new filters and update existing filters.
    }
  }

  const mItems = <Fragment>
    <MenuItem key="tag" onClick={handleItemClick}>
      <AppListItemTypography>Add new item </AppListItemTypography>
    </MenuItem>
    {
      store.displayFilter &&
      <MenuItem key="filter" onClick={handleCategoryClick}>
        <AppListItemTypography>Update filter </AppListItemTypography>
      </MenuItem>
    }
    {
      store.displayTag &&
      <MenuItem key="tag" onClick={handleCategoryClick}>
        <AppListItemTypography>Update tag </AppListItemTypography>
      </MenuItem>
    }
  </Fragment >
  return (
    <AppContainer mw="md" menuItems={mItems} title={pageHeader}>
      {store.itemModal && <AppItemModal />}
      {store.tagModal && <AppTagModal />}
      {store.filterModal && <AppFilterModal />}
      <AppPagePaper>
        <ItemListLayout search={search} title={pageHeader} />
      </AppPagePaper>
    </AppContainer>
  );
}
