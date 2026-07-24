
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
  IBreadcrumbContext,
  IChildReadRequest,
  IUrlSearch,
  IRouteStrings,
} from "@/domain/entities";
import {
  BreadcrumbContext
} from './useBreadcrumb';
import {
  decodeState,
} from '@/helpers/encoders';




export function BreadcrumbProvider({ children, route, }: { children: ReactNode, route: IRouteStrings }) {
  const navigate = useNavigate();
  const routeApi = getRouteApi(route);
  const csearch = decodeState(routeApi.useSearch({ select: (search: any) => search.c as unknown as string })) as unknown as IChildReadRequest;

  const breadcrumbClick = () => {
    navigate({ to: ".", search: (prev: IUrlSearch) => ({ s: prev.p }) });
  }
  const breadcrumbTail = csearch?.name ?? "";

  const contextValue = useMemo(() => ({
    breadcrumbClick,
    breadcrumbTail,
  } as unknown as IBreadcrumbContext),
    [
      breadcrumbClick,
      breadcrumbTail,
    ]
  );


  return <BreadcrumbContext.Provider value={contextValue}> {children} </BreadcrumbContext.Provider>
}
