
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
  IFilterReadRequest,
} from "@/domain/entities/filter";
import {
  encodeState
} from '@/utils/encoders';
import {
  DefaultItemRead,
} from '@/utils/defaults';
import type {
  IItemReadRequest,
} from '@/domain/entities/item';



export function useFilterListItemClick(query: IFilterReadRequest) {
  const navigate = useNavigate();
  const store: TAppStore = useAppStore((state) => state);
  const listItemClick = (idx: number, it: IFilter) => {
    const pageTitle = it && it.name ? `##${it.name}` : "Filters";
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, tags: it.tags ? it.tags : [] },
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
