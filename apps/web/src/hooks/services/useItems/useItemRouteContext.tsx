
import {
  getRouteApi,
} from '@tanstack/react-router';



import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import type {
  IItemRouteSearch,
} from "@/domain/entities/item";
import {
  decodeState
} from '@/utils/encoders';



export function useItemRouteContext() {
  const store: TAppStore = useAppStore((state) => state);

  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  const routeApi = getRouteApi('/items');
  const { search } = routeApi.useRouteContext();
  const { query, title, refTag, refFilter, } = search;
  const pageHeader = store.itemTitle ? store.itemTitle : search && title ? title : "All Items";
  const urlSearch = decodeState(routeApi.useSearch().s) as unknown as IItemRouteSearch;
  const passedTag = store.displayTag || urlSearch.refTag;
  const passedFilter = store.displayFilter || urlSearch.refFilter;

  // const routeContext = useRef({
  //   query, reference, pageHeader, title, urlSearch, passedTag, passedFilter,
  // })


  return {
    query,
    refTag,
    refFilter,
    pageHeader,
    title,
    urlSearch,
    passedTag,
    passedFilter,
  }

}
