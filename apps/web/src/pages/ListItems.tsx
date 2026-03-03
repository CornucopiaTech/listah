import {
  useParams
} from '@tanstack/react-router';


import { AppItemModal } from "@/components/core/AppItemModal";
import { AppSearchBar } from "@/components/core/AppSearchBar";
import { ItemListLayout } from "@/components/layout/ItemListLayout";
import {
  AppPageStack,
  AppSectionStack
} from "@/components/core/AppBox";
import { ItemsFab } from "@/components/core/ItemsFab";
import { AppItemListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';


export function ListItems() {
  const title = useParams({strict: false}).title;
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppPageStack>
      <AppSearchBar />
      <AppItemListPaper>
        <AppSectionStack>
          <AppListHeaderBar key="header">
            <AppH5ButtonTypography> Items in #{title} </AppH5ButtonTypography>
          </AppListHeaderBar>
          {store.itemModal && <AppItemModal />}
          <ItemListLayout />
        </AppSectionStack>
        <ItemsFab />
      </AppItemListPaper>
    </AppPageStack>
  );
}
