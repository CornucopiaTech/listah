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
  ITagReadRequest,
  ITagReadResponse,
} from "@/domain/entities/tag";
import {
  encodeState
} from '@/utils/encoders';
import type {
  IPagination,
} from '@/domain/entities/common';
import {
  DefaultPagination,
} from '@/utils/defaults';




export function useTagPagination(query: ITagReadRequest) {
  const navigate = useNavigate();
  let pageInfo = useRef<IPagination>({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize && query.pagination.pageSize ? query.pagination.pageSize : DefaultPagination.pageSize,
    totalRecords: 0,
    sort: "name",
  });

  const pageChange = (event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    event && event.stopPropagation();
    const q: ITagReadRequest = { ...query, pagination: { ...query.pagination, pageNumber: value } };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };


  const pageSizeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const pageSize = parseInt(e.target.value, 10);
    const pageNumber = 1;
    const q: ITagReadRequest = { ...query, pagination: { ...query.pagination, pageSize, pageNumber, } };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };

  const setPaginationInfo = (data: ITagReadResponse) => {
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
