import {
  getRouteApi,
} from '@tanstack/react-router';


// routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.

// type routes = ConstrainLiterals<"/" | "/items" | "/tags" | "filters", "/" | "/items" | "/tags" | "__root__" | "filters">;
type routes = "/" | "/items" | "/tags" | "__root__" | "/filters";

export function getRouteContext(rt: routes) {
  const routeApi = getRouteApi(rt);
  const { search } = routeApi.useRouteContext();
  const { query, title, pagination, reference, } = search;
  return { query, title, pagination, reference, };
}
