
import {
  getRouteApi,
} from '@tanstack/react-router';



export function useTagRouteContext() {
  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  const routeApi = getRouteApi('/tags');
  const { search: query } = routeApi.useRouteContext();

  return {
    query,
  }

}
