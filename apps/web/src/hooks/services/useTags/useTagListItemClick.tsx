
import {
  useNavigate,
} from '@tanstack/react-router';


// Internal
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import {
  encodeState
} from '@/utils/encoders';
import {
  DefaultReadRequest,
} from '@/domain/entities';
import type {
  IReadRequest,
  ITag,
} from '@/domain/entities';



export function useTagListItemClick(query: IReadRequest) {
  const navigate = useNavigate();
  const store: TAppStore = useAppStore((state) => state);
  const listItemClick = (idx: number, it: ITag) => {
    const pageTitle = it && it.name ? `#${it.name}` : "Tags";
    const pageTags = it && it.id ? [it.id] : [];
    const q: IReadRequest = {
      ...DefaultReadRequest,
      query: { ...DefaultReadRequest.query, userId: query.query.userId, tags: pageTags },
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
