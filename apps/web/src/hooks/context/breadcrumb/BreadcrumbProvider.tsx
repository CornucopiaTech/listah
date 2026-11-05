
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
} from "@/app-types";
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
} from '@/app-types';
import {
  DefaultUrlSearch,
} from '@/helpers/encoders';


export function BreadcrumbProvider({ children, route, }: { children: ReactNode, route: IRouteStrings }) {
  const navigate = useNavigate();
  // @ts-ignore
  const routeApi = getRouteApi(route);
  const csearch = decodeState(routeApi.useSearch({
    select: (search: any) => search.c as unknown as string
  })) as unknown as IChildReadRequest;

  const breadcrumbClick = () => {
    navigate({
      to: csearch?.parent ?? ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          p: prev.p,
          c: DefaultUrlSearch.c,
          e: DefaultUrlSearch.e,
          s: DefaultUrlSearch.s,
        }
      },
    });
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
  const parent = csearch?.parent ?? "";

  const contextValue = useMemo(() => ({
    route,
    parent,
    breadcrumbClick,
    breadcrumbTail,
    addNewItemClick,
    addNewFilterClick,
    addNewTagClick,
  } as unknown as IBreadcrumbContext), [route, csearch]);


  return <BreadcrumbContext.Provider value={contextValue}> {children} </BreadcrumbContext.Provider>
}
