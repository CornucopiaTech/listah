
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { TagListLayout } from "@/components/layout/TagList";
import { AppTagModal } from "@/components/core/AppTagModal";
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppContainer } from '@/components/layout/AppContainer';



export function Tags() {
  const store: TBoundStore = useBoundStore((state) => state);
  return (
    <AppContainer mw="md">
      {store.tagModal && <AppTagModal />}
      <AppPagePaper key="tags">
        <TagListLayout />
      </AppPagePaper>
    </AppContainer >
  );
}
