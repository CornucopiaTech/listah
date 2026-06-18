
import {
  getRouteApi,
} from '@tanstack/react-router';



import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import type {
  IReadRequest,
} from "@/domain/entities";
import {
  decodeState
} from '@/utils/encoders';



export function useItemRouteContext() {
  const store: TAppStore = useAppStore((state) => state);

  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  const routeApi = getRouteApi('/items');
  const { search } = routeApi.useRouteContext();
  const { query, title, reference, } = search;
  const pageHeader = store.itemTitle ? store.itemTitle : search && title ? title : "All Items";
  const urlSearch = decodeState(routeApi.useSearch().s) as unknown as IReadRequest;
  const passedTag = store.displayTag || urlSearch.reference.tag;
  const passedFilter = store.displayFilter || urlSearch.reference.filter;

  // const routeContext = useRef({
  //   query, reference, pageHeader, title, urlSearch, passedTag, passedFilter,
  // })


  return {
    query,
    reference,
    pageHeader,
    title,
    urlSearch,
    passedTag,
    passedFilter,
  }

}
