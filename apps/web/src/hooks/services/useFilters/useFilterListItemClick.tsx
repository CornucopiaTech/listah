
import {
  useNavigate,
} from '@tanstack/react-router';


// Internal
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import type {
  IFilter,
  IReadRequest,
} from "@/domain/entities";
import {
  DefaultReadRequest,
} from "@/domain/entities";
import {
  encodeState
} from '@/utils/encoders';




export function useFilterListItemClick(query: IReadRequest) {
  const navigate = useNavigate();
  const store: TAppStore = useAppStore((state) => state);
  const listItemClick = (idx: number, it: IFilter) => {
    const pageTitle = it && it.name ? `##${it.name}` : "Filters";
    const q: IReadRequest = {
      ...DefaultReadRequest,

      query: { ...DefaultReadRequest.query, userId: query.query.userId, tags: it.tags ? it.tags : [] },
    };
    const s = { query: q, title: pageTitle, refFilter: it, }
    const encoded = encodeState(s);

    navigate({ to: "/items", search: { s: encoded }, });
    store.setItemTitle(pageTitle);
    store.setDisplayFilter(it);
    store.setFilterScroll(idx);
  }

  return {
    listItemClick,
  }

}
