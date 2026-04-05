import {
  useParams
} from '@tanstack/react-router';


import {
  TagSearchBar,
} from "@/components/core/ItemSearchBar";

import { TagListLayout } from "@/components/layout/TagList";
import {
  AppPageStack,
} from "@/components/core/AppStack";
import { HomeFab } from "@/components/core/HomeFab";
import { AppFilterModal } from "@/components/core/FilterModal";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppItemModal } from "@/components/core/AppItemModal";
import {
  AppCategoryListPaper,
} from '@/components/core/AppPaper';
import { AppListHeaderBar } from '@/components/core/AppListHeaderBar';
import { AppH5ButtonTypography } from '@/components/core/ButtonTypography';
import { AppContainer } from '@/components/layout/AppContainer';



export function Tags() {
  const store: TBoundStore = useBoundStore((state) => state);
  const title = useParams({ strict: false }).title;
  const header = title ? `Tags like '${title}'` : "All Tags"
  return (
    <AppContainer mw="md">
      <AppPageStack>
        {store.itemModal && <AppItemModal />}
        {store.filterModal && <AppFilterModal />}
        <TagSearchBar />
        <AppCategoryListPaper>
          <AppListHeaderBar key="header">
            <AppH5ButtonTypography> {header} </AppH5ButtonTypography>
          </AppListHeaderBar>
          <TagListLayout />
        </AppCategoryListPaper>
        <HomeFab />
      </AppPageStack>
    </AppContainer >
  );
}
