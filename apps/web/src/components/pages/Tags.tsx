import { Fragment } from "react";


import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { TagListLayout } from "@/components/layout/TagList";
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

export function Tags() {
  const store: TBoundStore = useBoundStore((state) => state);
  function handleFilterClick() {
    store.setFilterModal(true);
  }

  function handleTagClick() {
    store.setTagModal(true);
  }

  const mItems = <Fragment>
    <MenuItem key="tag" onClick={handleTagClick}>
      <AppListItemTypography>Add new tag </AppListItemTypography>
    </MenuItem>
    <MenuItem key="filter" onClick={handleFilterClick}>

      <AppListItemTypography>Add new filter </AppListItemTypography>
    </MenuItem>
  </Fragment >
  return (
    <AppContainer mw="md" menuItems={mItems}>
      {store.tagModal && <AppTagModal />}
      {store.filterModal && <AppFilterModal />}
      <AppPagePaper key="tags">
        <TagListLayout />
      </AppPagePaper>
    </AppContainer >
  );
}
