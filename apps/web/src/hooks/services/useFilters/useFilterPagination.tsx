import type {
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';




import type {
  IFilterReadRequest,
  IFilterReadResponse,
} from "@/domain/entities/filter";
import {
  encodeState
} from '@/utils/encoders';






export function useFilterPagination(query: IFilterReadRequest) {
  const navigate = useNavigate();


  const pageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) => {
    event && event.stopPropagation();
    const q: IFilterReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageNumber: value
      }
    };
    console.info('In pageChange', q);
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };


  const pageSizeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const q: IFilterReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageSize: parseInt(e.target.value, 10), pageNumber: 1,
      }
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };


  return {
    pageChange,
    pageSizeChange,
  }

}
