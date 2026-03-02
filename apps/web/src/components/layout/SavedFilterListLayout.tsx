

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
  getRouteApi,
} from '@tanstack/react-router';
import { useUser } from '@clerk/clerk-react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';


import type { IItemReadRequest } from '@/lib/model/item';
import type {
  THomeQueryParams
} from '@/lib/model/home';
import type {
  ISavedFilterCategory,
  ISavedFilterCategoryReadResponse,
} from "@/lib/model/savedFilter";
import {
  ZSavedFilterCategoryReadResponse,
} from "@/lib/model/savedFilter";
import { CategoryList } from "@/components/core/CategoryList";
import { savedFilterGroupOptions } from '@/lib/helper/querying';
import Loading from '@/components/common/Loading';
import { ErrorAlert} from "@/components/core/Alerts";
import { encodeState, decodeState } from '@/lib/helper/encoders';
import { DefaultQueryParams } from '@/lib/helper/defaults';



export function SavedFilterListLayout(): ReactNode {
  const routeApi = getRouteApi('/');
  const routeSearch = routeApi.useSearch()
  let search = decodeState(routeSearch.s) as THomeQueryParams;
  const navigate = useNavigate();
  const { user, } = useUser();

  console.info("In TagListLayout - query ", search);
  const query = {
    savedFilter: { ...search.savedFilter, userId: user.id },
    tag: { ...search.tag, userId: user.id }
  }

  console.info("In SavedFilterListLayout - query ", query);
  console.info("In SavedFilterListLayout - search ", search);

  const {
    isPending, isError, data, error
  }: UseQueryResult<ISavedFilterCategoryReadResponse> = useQuery(savedFilterGroupOptions(query.savedFilter));


  if (isPending) {
    return (
      <Box key="data-content"
        style={{
          height: `60vh`,
          width: '100%', display: 'block', overflow: 'auto',
        }}>
        {/* <Loading /> */}
        {/* <CircularProgress size="6rem" /> */}
        <LinearProgress />
      </Box>
    );
  }
  if (isError) { return <ErrorAlert message={error.message} />; }

  try{
    ZSavedFilterCategoryReadResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlert message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlert message="An error occurred. Please try again" />;
    }
  }

  const categories: ISavedFilterCategory[] = data && data.categories ? data.categories : [];



  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q: THomeQueryParams = { ...query, savedFilter: { ...query.savedFilter, pageNumber: value } };
    const encoded = encodeState(q);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q: THomeQueryParams = {
      ...query,
      savedFilter: {...query.savedFilter, pageSize: parseInt(e.target.value, 10), pageNumber: 0,}
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handleItemclick(it: ISavedFilterCategory) {
    console.log("In handleItemclick");
    const ct = it && it.id ? it.id : "";
    const q: IItemReadRequest = {
      ...DefaultQueryParams,
      userId: query.savedFilter.userId,
      filter: [ct],
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/items/$title", search: { s: encoded }, params: { title: it.category} });
  }
  const totalRecords: number = data.pageSize ? data.pageSize : 1;


  return (
    <CategoryList title="SavedFilters" data={categories}
      handleItemClick={handleItemclick}
      count={totalRecords} page={query.savedFilter.pageNumber}
      onPageChange={handlePageChange}
      rowsPerPage={query.savedFilter.pageSize}
      onRowsPerPageChange={handlePageSizeChange}
    />
  );
}
