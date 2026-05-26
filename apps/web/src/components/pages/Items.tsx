
import { Fragment } from "react";
import {
  getRouteApi,
} from '@tanstack/react-router';



import { AppItemModal } from "@/components/layout/AppItemModal";
import { ItemListLayout } from "@/components/layout/ItemList";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppTagModal } from "@/components/layout/AppTagModal";
import { AppFilterModal } from "@/components/layout/AppFilterModal";
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  DefaultItem,
} from "@/lib/helper/defaults";
import {
  AppListItemTypography,
} from "@/components/core/Typography";
import type {
  // IItem,
  // IItemReadRequest,
  // IItemReadResponse,
  IItemRouteSearch,
} from "@/lib/model/item";
import {
  decodeState
} from '@/lib/helper/encoders';


export function Items() {
  const store: TBoundStore = useBoundStore((state) => state);
  // const isTag = store.displayTag !== undefined;
  // const isFilter = store.displayFilter !== undefined;

  const routeApi = getRouteApi('/items/');
  const { search } = routeApi.useRouteContext();
  const pageHeader = store.itemTitle ? store.itemTitle : search && search.title ? search.title : "All Items";
  const urlSearch = decodeState(routeApi.useSearch().s) as unknown as IItemRouteSearch;
  // console.info(' decodeState(routeApi.useSearch())', decodeState(routeApi.useSearch().s));
  // console.info(' urlSearch', urlSearch);

  const passedTag = store.displayTag || urlSearch.refTag;
  const passedFilter = store.displayFilter || urlSearch.refFilter;
  // console.info('passedFilter', passedFilter);
  // console.info('passedTag', passedTag);




  function handleItemClick() {
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


  function handleCategoryClick() {
    if (passedTag) {
      store.setTagModal(true);
    } else if (passedFilter) {
      store.setFilterModal(true);
      // ToDo: Update Filter Modal to be able to create new filters and update existing filters.
    }
  }

  const mItems = (
    <Fragment>
      <MenuItem key="tag" onClick={handleItemClick}>
        <AppListItemTypography>Add new item </AppListItemTypography>
      </MenuItem>
      {
        // ToDo: It should read from store or from url to find out if a filtered item is set.
        (store.displayFilter || urlSearch?.refFilter) &&
        <MenuItem key="filter" onClick={handleCategoryClick}>
          <AppListItemTypography>Update filter </AppListItemTypography>
        </MenuItem>
      }
      {
        // ToDo: It should read from store or from url to find out if a filtered item is set.
        (store.displayTag || urlSearch?.refTag) &&
        <MenuItem key="tag" onClick={handleCategoryClick}>
          <AppListItemTypography>Update tag </AppListItemTypography>
        </MenuItem>
      }
    </Fragment >
  );
  return (
    <AppContainer mw="md" menuItems={mItems} title={pageHeader}>
      {store.itemModal && <AppItemModal itemTag={passedTag} itemFilter={passedFilter} />}
      {store.tagModal && <AppTagModal itemTag={passedTag} />}
      {store.filterModal && <AppFilterModal itemFilter={passedFilter} />}
      <AppPagePaper>
        <ItemListLayout />
      </AppPagePaper>
    </AppContainer>
  );
}
