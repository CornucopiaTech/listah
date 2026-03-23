import {
  useParams
} from '@tanstack/react-router';


import { AppItemModal } from "@/components/core/AppItemModal";
// import {
//   AppSearchBar,
// } from "@/components/core/AppSearchBar";
import { ItemListLayout } from "@/components/layout/ItemList";
import {
  AppPageStack,
} from "@/components/core/AppStack";
import { ItemsFab } from "@/components/core/ItemsFab";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  AppCategoryListPaper,
} from '@/components/core/AppPaper';


export function Items() {
  const title = useParams({ strict: false }).title;
  const store: TBoundStore = useBoundStore((state) => state);
  const header = title ? `Items in #${title}` : "All Items"
  return (
    <AppContainer mw="md">
      <AppPageStack>
        {store.itemModal && <AppItemModal route={"/items/{-$title}"} />}
        {/* <AppSearchBar route="/items/$title" /> */}
        <AppCategoryListPaper>
          <AppListHeaderBar key="header">
            <AppH5ButtonTypography> {header} </AppH5ButtonTypography>
          </AppListHeaderBar>
          <ItemListLayout />
        </AppCategoryListPaper>
        <ItemsFab />
      </AppPageStack>
    </AppContainer>
  );
}
