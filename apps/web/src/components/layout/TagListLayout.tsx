

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
  ITagCategory,
  ITagCategoryReadResponse,
} from "@/lib/model/tag";
import {
  ZTagCategoryReadResponse,
} from "@/lib/model/tag";
import { SlimCategoryList } from "@/components/core/CategoryList";
import { tagGroupOptions } from '@/lib/helper/querying';
import Loading from '@/components/common/Loading';
import { ErrorAlert} from "@/components/core/Alerts";
import { decodeState, encodeState } from '@/lib/helper/encoders';
import { DefaultQueryParams } from '@/lib/helper/defaults';
import { AppCategoryListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import { AppH6Typography } from "@/components/core/Typography";
import { AppSectionStack } from "@/components/core/AppBox";


function OuterShell( { children }: { children: ReactNode}): ReactNode {
  return (
    <AppCategoryListPaper>
      <AppSectionStack>
        <AppListHeaderBar key="header">"
          <AppH5ButtonTypography> Tags </AppH5ButtonTypography>
        </AppListHeaderBar>
        {children}
      </AppSectionStack>
    </AppCategoryListPaper>
  );
}


export function TagListLayout(): ReactNode {
  const routeApi = getRouteApi('/');
  const routeSearch = routeApi.useSearch()
  let search =   decodeState(routeSearch.s) as THomeQueryParams;
  const navigate = useNavigate();
  const { user, } = useUser();

  console.info("In TagListLayout - query ", search);
  const query = {
    savedFilter: {...search.savedFilter, userId: user.id},
    tag: {...search.tag, userId: user.id}
  }

  console.info("In TagListLayout - search ", search);
  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagCategoryReadResponse> = useQuery(tagGroupOptions(query.tag));


  if (isPending) {
    return (
      <OuterShell>
        <LinearProgress />
      </OuterShell>


    );
  }
  if (isError) { return <ErrorAlert message={error.message} />; }

  try{
    ZTagCategoryReadResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlert message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlert message="An error occurred. Please try again" />;
    }
  }

  const categories: ITagCategory[] = data && data.categories ? data.categories : [];



  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q: THomeQueryParams = { ...query, tag: { ...query.tag, pageNumber: value } };
    const encoded = encodeState(q);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q: THomeQueryParams = {
      ...query,
      tag: {...query.tag, pageSize: parseInt(e.target.value, 10), pageNumber: 0,}
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handleItemclick(it: ITagCategory) {
    console.log("In handleItemclick");
    const ct = it && it.category ? it.category : "";
    const q: IItemReadRequest = {
      ...DefaultQueryParams,
      userId: query.tag.userId,
      filter: [ct],
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/items/$title", search: { s: encoded }, params: { title: it.category } });
  }
  const totalRecords: number = data.pageSize ? data.pageSize : 1;


  return (
    // <CategoryList title="Tags" data={categories}
    //   handleItemClick={handleItemclick}
    //   count={totalRecords} page={query.tag.pageNumber}
    //   onPageChange={handlePageChange}
    //   rowsPerPage={query.tag.pageSize}
    //   onRowsPerPageChange={handlePageSizeChange}
    // />

        <OuterShell>
          <SlimCategoryList title="Tags" data={categories}
            handleItemClick={handleItemclick}
            count={totalRecords} page={query.tag.pageNumber}
            onPageChange={handlePageChange}
            rowsPerPage={query.tag.pageSize}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </OuterShell>


  );
}
