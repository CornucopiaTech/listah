
import { AppSearchBar } from "@/components/core/AppSearchBar";
import { ItemListLayout } from "@/components/layout/ItemListLayout";
import { AppListStack, AppPageStack } from "@/components/core/AppBox";
import { ItemsFab } from "@/components/core/ItemsFab";


export function ListItems() {
  return (
    <AppPageStack>
      <AppSearchBar />
      <AppListStack>
        <ItemListLayout />
      </AppListStack>
      <ItemsFab />
    </AppPageStack>
  );
}
