
import { AppSearchBar } from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagListLayout";
import { SavedFilterListLayout } from "@/components/layout/SavedFilterListLayout";
import { AppListStack, AppPageStack } from "@/components/core/AppBox";
import { HomeFab } from "@/components/core/HomeFab";
import { AppFilterModal } from "@/components/core/FilterModal";


import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppItemModal } from "@/components/core/AppItemModal";



export function Home() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppPageStack>
      {store.itemModal && <AppItemModal />}
      {store.filterModal && <AppFilterModal />}
      <AppSearchBar />
      <AppListStack>
        <SavedFilterListLayout />
        <TagListLayout />
      </AppListStack>
      <HomeFab />
    </AppPageStack>
  );
}
