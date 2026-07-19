import {
  getRouteApi,
} from '@tanstack/react-router';


import type {
  IReadQuery,
  IPagination,
  IReadRequest,
} from "@/domain/entities";
import {
  decodeState,
} from '@/utils/encoders';


// routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.

type routes = "/" | "/items" | "/tags" | "__root__" | "/filters";

export function getRouteContext(rt: routes) {
  try {
    const routeApi = getRouteApi(rt);
    const { search } = routeApi.useRouteContext();
    const { query, title, pagination, reference, } = search;
    return { query, title, pagination, reference, };
  }
  catch {
    return { query: null, title: null, pagination: null, reference: null, }
  }

}

export function getRouteLoaderData(rt: routes) {
  try {
    const routeApi = getRouteApi(rt);
    return routeApi.useLoaderData();
  }
  catch {
  }
}


export function getRouteSearch(rt: routes) {
  try {
    const routeApi = getRouteApi(rt);
    const { s }: { s: string } = routeApi.useSearch();
    const { query, pagination, reference, title, } = decodeState(s) as unknown as IReadRequest;
    return { query, pagination, reference, title, };
  }
  catch {
    return { query: null, pagination: null, reference: null, title: null, }
  }
}
