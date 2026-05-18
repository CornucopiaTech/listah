import { Fragment } from "react";


import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { FilterListLayout } from "@/components/layout/FilterList";
import { AppTagModal } from "@/components/layout/AppTagModal";
import { AppFilterModal } from "@/components/layout/AppFilterModal";
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  AppListItemTypography,
} from "@/components/core/Typography";



export function Filters() {
  const store: TBoundStore = useBoundStore((state) => state);
  function handleTagClick() {
    store.setTagModal(true);
  }

  function handleFilterClick() {
    store.setFilterModal(true);
  }

  const mItems = <Fragment>
    {/* <MenuItem key="tag" onClick={handleTagClick}>
      <AppListItemTypography>Create new tag </AppListItemTypography>
    </MenuItem> */}
    <MenuItem key="filter" onClick={handleFilterClick}>
      <AppListItemTypography>Create new filter </AppListItemTypography>
    </MenuItem>
  </Fragment >;

  return (
    <AppContainer mw="md" menuItems={mItems}>
      {store.tagModal && <AppTagModal />}
      {store.filterModal && <AppFilterModal />}
      <AppPagePaper key="tags">
        <FilterListLayout />
      </AppPagePaper>
    </AppContainer >
  );
}
