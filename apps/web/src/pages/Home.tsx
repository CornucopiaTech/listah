
import { AppSearchBar } from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagListLayout";
import { SavedFilterListLayout } from "@/components/layout/SavedFilterListLayout";
import { AppListStack, AppPageStack } from "@/components/core/AppBox";
import { HomeFab } from "@/components/core/HomeFab";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';


export function Home() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppPageStack>
      {store.modal && <AppItemModal />}
      <AppSearchBar />
      <AppListStack>
        <SavedFilterListLayout />
        <TagListLayout />
      </AppListStack>
      <HomeFab />
    </AppPageStack>
  );
}
