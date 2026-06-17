
import {
  useNavigate,
} from '@tanstack/react-router';


// Internal
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import type {
  ITag,
  ITagReadRequest,
} from "@/domain/entities/tag";
import {
  encodeState
} from '@/utils/encoders';
import {
  DefaultItemRead,
} from '@/utils/defaults';
import type {
  IItemReadRequest,
} from '@/domain/entities/item';



export function useTagListItemClick(query: ITagReadRequest) {
  const navigate = useNavigate();
  const store: TAppStore = useAppStore((state) => state);
  const listItemClick = (idx: number, it: ITag) => {
    const pageTitle = it && it.name ? `#${it.name}` : "Tags";
    const pageTags = it && it.id ? [it.id] : [];
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, tags: pageTags },
    };
    const s = { query: q, title: pageTitle, refTag: it, }
    const encoded = encodeState(s);

    navigate({ to: "/items", search: { s: encoded }, });
    store.setItemTitle(pageTitle);
    store.setItemReference(it);
    store.setDisplayTag(it);
    store.setTagScroll(idx);
  }

  return {
    listItemClick,
  }

}
