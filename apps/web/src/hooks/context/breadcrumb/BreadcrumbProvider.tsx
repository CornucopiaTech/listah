
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
  encodeState,
  decodeState
} from '@/helpers/encoders';
import {
  DefaultItem,
  DefaultFilter,
  DefaultTag,
} from '@/domain/entities';



export function BreadcrumbProvider({ children, route, }: { children: ReactNode, route: IRouteStrings }) {
  const navigate = useNavigate();
  const routeApi = getRouteApi(route);
  const csearch = decodeState(routeApi.useSearch({ select: (search: any) => search.c as unknown as string })) as unknown as IChildReadRequest;

  const breadcrumbClick = () => {
    // @ts-ignore
    navigate({ to: ".", search: (prev: IUrlSearch) => ({ s: prev.p }) });
  }

  const addNewItemClick = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: DefaultItem, flag: true, modal: "item" })
        }
      }
    });
  }

  const addNewFilterClick = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: DefaultFilter, flag: true, modal: "filter" })
        }
      }
    });
  }

  const addNewTagClick = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: DefaultTag, flag: true, modal: "tag" })
        }
      }
    });
  }
  const breadcrumbTail = csearch?.name ?? "";

  const contextValue = useMemo(() => ({
    route,
    breadcrumbClick,
    breadcrumbTail,
    addNewItemClick,
    addNewFilterClick,
    addNewTagClick,
  } as unknown as IBreadcrumbContext), [route, csearch]);


  return <BreadcrumbContext.Provider value={contextValue}> {children} </BreadcrumbContext.Provider>
}
