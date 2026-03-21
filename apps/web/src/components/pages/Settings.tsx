

// import {
//   AppSearchBar,
//   // AppHomeSearchBar
// } from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagList";
import { SavedFilterListLayout } from "@/components/layout/FilterList";
import {
  AppListStack,
  AppPageStack,
  AppSectionStack
} from "@/components/core/AppStack";
import { HomeFab } from "@/components/core/HomeFab";
import { AppFilterModal } from "@/components/core/FilterModal";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppCategoryListPaper } from '@/components/core/AppPaper';
import { AppListHeaderBar } from '@/components/core/AppListHeaderBar';
import { AppH5ButtonTypography } from '@/components/core/ButtonTypography';
import { AppContainer } from '@/components/layout/AppContainer';

export function Settings() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppContainer mw="md">
      <AppPageStack>
        {store.settingModal && <AppFilterModal />}
        {/* <AppSearchBar route="/" /> */}
        <AppListStack>
          <AppCategoryListPaper>
            <AppSectionStack>
              <AppListHeaderBar key="header">
                <AppH5ButtonTypography> Saved Filters </AppH5ButtonTypography>
              </AppListHeaderBar>
              <SavedFilterListLayout />
            </AppSectionStack>
          </AppCategoryListPaper>

          <AppCategoryListPaper>
            <AppSectionStack>
              <AppListHeaderBar key="header">
                <AppH5ButtonTypography> Tags </AppH5ButtonTypography>
              </AppListHeaderBar>
              <TagListLayout />
            </AppSectionStack>
          </AppCategoryListPaper>
        </AppListStack>
        <HomeFab />
      </AppPageStack>
    </AppContainer>

  );
}
