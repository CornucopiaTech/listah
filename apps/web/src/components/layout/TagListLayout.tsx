

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
import { ErrorAlert} from "@/components/core/Alerts";
import { encodeState } from '@/lib/helper/encoders';


export function TagListLayout(): ReactNode {
  const query: ICategoryRequest = useSearchQuery();
  const navigate = useNavigate();
  const {
    isPending, isError, data, error
  }: UseQueryResult<ICategoryResponse> = useQuery(categoryGroupOptions(query));


  if (isPending) { return <Loading />; }
  if (isError) { return <ErrorAlert message={error.message} />; }

  try{
    ZCategoryResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlert message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlert message="An error occurred. Please try again" />;
    }
  }

  const categories: ICategory[] = data && data.categories ? data.categories : [];



  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q: ICategoryRequest = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q: ICategoryRequest = {
      ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0,
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handleItemclick(it: ICategory) {
    console.log("In handleItemclick");
    const ct = it && it.category ? it.category : "";
    const q: ICategoryRequest = {
      ...query, filter: [ct],
      pageNumber: 0, searchQuery: "",
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/items", search: { s: encoded }, });
  }
  const totalRecords: number = data.pageSize ? data.pageSize : 1;


  return (
    <CategoryList title="Tags" data={categories}
      handleItemClick={handleItemclick}
      count={totalRecords} page={query.pageNumber}
      onPageChange={handlePageChange}
      rowsPerPage={query.pageSize}
      onRowsPerPageChange={handlePageSizeChange}
    />
  );
}
