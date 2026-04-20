import {
  useParams
} from '@tanstack/react-router';


import { AppItemModal } from "@/components/core/AppItemModal";
import {
  AppSearchBar,
} from "@/components/core/AppSearchBar";
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
import { AppTagModal } from "@/components/core/AppTagModal";

export function Items() {
  const title = useParams({ strict: false }).title;
  const store: TBoundStore = useBoundStore((state) => state);
  const header = title ? title : "All Items"
  // Set src as a param for /items/{title} so it can be used for the modals from /items/{title}
  return (
    <AppContainer mw="sm">
      <AppPageStack>
        {store.itemModal && <AppItemModal />}
        {store.tagModal && <AppTagModal />}
        <AppSearchBar />
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
