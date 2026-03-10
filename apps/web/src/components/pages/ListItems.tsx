import {
  useParams
} from '@tanstack/react-router';


import { AppItemModal } from "@/components/core/AppItemModal";
import {
  AppSearchBar,
} from "@/components/core/AppSearchBar";
import { ItemListLayout } from "@/components/layout/ItemListLayout";
import {
  AppPageStack,
  AppSectionStack
} from "@/components/core/AppStack";
import { ItemsFab } from "@/components/core/ItemsFab";
import { AppItemListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
// import { HomeBreadcrumbs } from '@/components/core/HomeBreadcrumb';
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';


export function ListItems() {
  const title = useParams({strict: false}).title;
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppPageStack>
      {/* <HomeBreadcrumbs /> */}
      {store.itemModal && <AppItemModal route={"/items/$title"} />}
      <AppSearchBar route="/items/$title" />
      <AppItemListPaper>
        <AppSectionStack>
          <AppListHeaderBar key="header">
            <AppH5ButtonTypography> Items in #{title} </AppH5ButtonTypography>
          </AppListHeaderBar>

          <ItemListLayout />
        </AppSectionStack>
        <ItemsFab />
      </AppItemListPaper>
    </AppPageStack>
  );
}
