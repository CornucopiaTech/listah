
import { AppSearchBar } from "@/components/core/AppSearchBar";
import { TagList } from "@/components/layout/TagList";
import { SavedFilterList } from "@/components/layout/SavedFilterList";
import { AppListBox, AppPageStack } from "@/components/core/AppBox";
import { HomeFab } from "@/components/core/HomeFab";


export function Home() {
  return (
    <AppPageStack>
      <AppSearchBar />
      <AppListBox>
        <SavedFilterList />
        <TagList />
      </AppListBox>
      <HomeFab />
    </AppPageStack>

  );
}
