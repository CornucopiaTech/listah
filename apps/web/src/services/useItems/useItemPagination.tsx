import type {
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';
import {
  useRef,
} from "react";



import type {
  IItemReadRequest,
  IItemReadResponse,
  // IItemRouteSearch,
} from "@/entities/item";

import type {
  ITag,
} from "@/entities/tag";

import type {
  IFilter,
} from "@/entities/filter";
import {
  encodeState
} from '@/utils/encoders';
import type {
  IPagination,
} from '@/entities/common';
import {
  DefaultPagination,
} from '@/utils/defaults';




export function useItemPagination(query: IItemReadRequest, title: string, reference: null | ITag | IFilter) {
  const navigate = useNavigate();
  let pageInfo = useRef<IPagination>({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize && query.pagination.pageSize ? query.pagination.pageSize : DefaultPagination.pageSize,
    totalRecords: 0,
    sort: "name",
  });

  function getRouteSearch(qs: IItemReadRequest) {
    const s = { query: qs, title, reference: reference || undefined, }
    return encodeState(s);
  }

  const pageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) => {
    event && event.stopPropagation();
    const q = { ...query, pagination: { ...query.pagination, pageNumber: value } };
    ;
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };


  const pageSizeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const q = {
      ...query,
      pagination: {
        ...query.pagination,
        pageSize: parseInt(e.target.value, 10), pageNumber: 1
      }
    };
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };

  const setPaginationInfo = (data: IItemReadResponse) => {


    const pageSize = parseInt(data.pagination.pageSize as unknown as string, 10);
    const totalRecords = data.totalRecordCount ? parseInt(data.totalRecordCount as unknown as string, 10) : 1;
    const pageNumber = data.pagination.pageNumber ? parseInt(data.pagination.pageNumber as unknown as string, 10) : query.pagination.pageNumber
    const sort = "name";
    pageInfo.current = { sort, pageSize, totalRecords, pageNumber };
    console.info('pageSize', pageSize);
  }

  return {
    pageInfo,
    pageChange,
    pageSizeChange,
    setPaginationInfo,
  }

}
