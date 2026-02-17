
import { AppSearchBar } from "@/components/core/AppSearchBar";
import { TagListLayout } from "@/components/layout/TagListLayout";
import { SavedFilterListLayout } from "@/components/layout/SavedFilterListLayout";
import { AppListStack, AppPageStack } from "@/components/core/AppBox";
import { HomeFab } from "@/components/core/HomeFab";


export function Home() {
  return (
    <AppPageStack>
      <AppSearchBar />
      <AppListStack>
        <SavedFilterListLayout />
        <TagListLayout />
      </AppListStack>
      <HomeFab />
    </AppPageStack>
  );
}
