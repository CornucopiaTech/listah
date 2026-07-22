
import {
  useMemo,
} from 'react';

import type {
  ReactNode,
} from 'react';
import {
  useNavigate,
  getRouteApi,
} from '@tanstack/react-router';



// Internal imports
import type {
  ITagRouteContext,
  IReadRequest,
  IChildReadRequest,
} from "@/domain/entities";
import {
  TagRouteContext
} from './useTag';
import {
  encodeState,
  decodeState,
} from '@/helpers/encoders';




export function TagRouteProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const routeApi = getRouteApi("/tags");
  const psearch = decodeState(routeApi.useSearch({ select: (search) => search.s, })) as unknown as IReadRequest;
  const csearch = decodeState(routeApi.useSearch({ select: (search) => search.c, })) as unknown as IChildReadRequest;





  const breadcrumbClick = () => {
    const s = encodeState({ query: psearch.query, pagination: psearch.pagination, });
    navigate({ to: ".", search: { s } });
  }
  const breadcrumbTail = csearch?.name ?? "";

  const contextValue = useMemo(() => ({
    breadcrumbClick,
    breadcrumbTail,
  } as unknown as ITagRouteContext),
    [
      breadcrumbClick,
      breadcrumbTail,
    ]
  );


  return <TagRouteContext.Provider value={contextValue}> {children} </TagRouteContext.Provider>
}
