import type {
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';




import {
  encodeState
} from '@/utils/encoders';
import type {
  IItemReadRequest,
  ITag,
  IFilter,
} from '@/domain/entities';




export function useItemPagination(query: IItemReadRequest, title: string, refTag: null | ITag, refFilter: null | IFilter) {
  const navigate = useNavigate();

  function getRouteSearch(qs: IItemReadRequest) {
    const s = { query: qs, title, refTag, refFilter, }
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
    console.info('In Items - pageSizeChange', q.pagination.pageSize);
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };

  return {
    pageChange,
    pageSizeChange,
  }
}
