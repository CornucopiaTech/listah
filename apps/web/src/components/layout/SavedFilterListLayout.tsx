

import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";
import {
  useNavigate,
} from '@tanstack/react-router';



import type {
  ICategory,
  ICategoryRequest,
  ICategoryResponse,
} from "@/lib/model/category";
import {
  ZCategoryResponse,
} from "@/lib/model/category";
import { CategoryList } from "@/components/core/CategoryList";
import { useSearchQuery } from '@/lib/context/queryContext';
import { categoryGroupOptions } from '@/lib/helper/querying';
import Loading from '@/components/common/Loading';
import { Error } from '@/components/common/Error';
import { encodeState } from '@/lib/helper/encoders';



const emptyModelData: ICategory[] = [];

export function SavedFilterListLayout(): ReactNode {
  const query: ICategoryRequest = useSearchQuery();
  const navigate = useNavigate();
  const {
    isPending, isError, data, error
  }: UseQueryResult<ICategoryResponse> = useQuery(categoryGroupOptions(query));


  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }

  try{
    ZCategoryResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <Error message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <Error message="An error occurred. Please try again" />;
    }
  }

  const categories: ICategory[] = data && data.categories ? data.categories : [];



  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q = { ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0 };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/", search: { s: encoded } });
  };

  const totalRecords: number = data.pageSize ? data.pageSize : 1;


  return (
    <CategoryList title="Tags" data={emptyModelData}
      handleItemClick={() => (1 + 1)}
      count={0} page={0}
      onPageChange={handlePageChange}
      rowsPerPage={0}
      onRowsPerPageChange={handlePageSizeChange}
    />
  );
}
