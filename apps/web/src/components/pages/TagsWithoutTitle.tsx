
// import {
//   AppSearchBar,
//   // AppHomeSearchBar
// } from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagList";
import {
  AppPageStack,
} from "@/components/core/AppStack";
import { HomeFab } from "@/components/core/HomeFab";
// import { AppFilterModal } from "@/components/core/FilterModal";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
// import { AppItemModal } from "@/components/core/AppItemModal";
import {
  AppCategoryListPaper,
} from '@/components/core/AppPaper';
import { AppListHeaderBar } from '@/components/core/AppListHeaderBar';
import { AppH5ButtonTypography } from '@/components/core/ButtonTypography';
import { AppContainer } from '@/components/layout/AppContainer';



export function Tags() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppContainer mw="sm">
      <AppPageStack>
        {/* {store.itemModal && <AppItemModal route="/" />}
        {store.filterModal && <AppFilterModal />} */}
        {/* <AppSearchBar route="/tags" /> */}
        {/* <AppHomeSearchBar /> */}
        <AppCategoryListPaper>
          <AppListHeaderBar key="header">
            <AppH5ButtonTypography> Tags </AppH5ButtonTypography>
          </AppListHeaderBar>
          <TagListLayout />
        </AppCategoryListPaper>
        <HomeFab />
      </AppPageStack>
    </AppContainer >
  );
}
