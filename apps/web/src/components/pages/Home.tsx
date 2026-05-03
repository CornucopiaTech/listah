
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import {
  AppSearchBar,
} from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagList";
import { FilterListLayout } from "@/components/layout/FilterList";
import {
  AppPageStack,
  AppCategoryStack,
} from "@/components/core/AppStack";
import { HomeFab } from "@/components/core/HomeFab";
import { AppFilterModal } from "@/components/core/AppFilterModal";
import { AppTagModal } from "@/components/core/AppTagModal";
import {
  AppCategoryListPaper,
} from '@/components/core/AppPaper';
import { AppListHeaderBar } from '@/components/core/AppListHeaderBar';
import { AppH5ButtonTypography } from '@/components/core/ButtonTypography';
import { AppContainer } from '@/components/layout/AppContainer';



export function Home() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppContainer mw="lg">
      <AppPageStack>
        {store.tagModal && <AppTagModal />}
        {store.filterModal && <AppFilterModal />}
        <AppSearchBar />
        <AppCategoryStack>
          <AppCategoryListPaper key="filters">
            <AppListHeaderBar key="header">
              <AppH5ButtonTypography> Filters </AppH5ButtonTypography>
            </AppListHeaderBar>
            <FilterListLayout />
          </AppCategoryListPaper>
          <AppCategoryListPaper key="tags">
            <AppListHeaderBar key="header">
              <AppH5ButtonTypography> Tags </AppH5ButtonTypography>
            </AppListHeaderBar>
            <TagListLayout />
          </AppCategoryListPaper>
        </AppCategoryStack>
        <HomeFab />
      </AppPageStack>
    </AppContainer >
  );
}
