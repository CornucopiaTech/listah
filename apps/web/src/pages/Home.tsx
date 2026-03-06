

import { AppHomeSearchBar } from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagListLayout";
import { SavedFilterListLayout } from "@/components/layout/SavedFilterListLayout";
import {
  AppListStack,
  AppPageStack,
  AppSectionStack
} from "@/components/core/AppBox";
import { HomeFab } from "@/components/core/HomeFab";
import { AppFilterModal } from "@/components/core/FilterModal";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppItemModal } from "@/components/core/AppItemModal";
import { AppCategoryListPaper } from '@/components/core/AppPaper';
import { AppListHeaderBar } from '@/components/core/AppListHeaderBar';
import { AppH5ButtonTypography } from '@/components/core/ButtonTypography';


export function Home() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppPageStack>
      {store.itemModal && <AppItemModal />}
      {store.filterModal && <AppFilterModal />}
      <AppHomeSearchBar />
      <AppListStack>
        <AppCategoryListPaper>
          <AppSectionStack>
            <AppListHeaderBar key="header">"
              <AppH5ButtonTypography> Saved Filters </AppH5ButtonTypography>
            </AppListHeaderBar>
            <SavedFilterListLayout />
          </AppSectionStack>
        </AppCategoryListPaper>

        <AppCategoryListPaper>
          <AppSectionStack>
            <AppListHeaderBar key="header">"
              <AppH5ButtonTypography> Tags </AppH5ButtonTypography>
            </AppListHeaderBar>
            <TagListLayout />
          </AppSectionStack>
        </AppCategoryListPaper>
      </AppListStack>
      <HomeFab />
    </AppPageStack>
  );
}
