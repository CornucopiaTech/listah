



import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Fragment,
  useRef,
} from "react";
import { Virtuoso } from 'react-virtuoso';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";
import {
  useNavigate,
  getRouteApi,
} from '@tanstack/react-router';
import { useUser } from '@clerk/react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';


import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import type { IItemReadRequest } from '@/lib/model/item';
import type {
  IFilter,
  IFilterReadRequest,
  IFilterReadResponse,
} from "@/lib/model/filter";
import {
  ZFilterReadResponse,
} from "@/lib/model/filter";
import { filterGroupOptions } from '@/lib/helper/querying';
import { ErrorAlert } from "@/components/core/Alerts";
import { encodeState, decodeState } from '@/lib/helper/encoders';
import {
  DefaultItemRead,
  DefaultFilterRead,
  ListBoxSize,
} from '@/lib/helper/defaults';
import { AppH6Typography } from "@/components/core/Typography";



function OuterBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Fragment>
      <Box key="data-content" sx={ListBoxSize}>
        {children}
      </Box>
    </Fragment>
  );
}
export function FilterListLayout(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const navigate = useNavigate();
  const { user, } = useUser();
  const routeApi = getRouteApi('/');
  const routeSearch: { s: string } = routeApi.useSearch()
  let search: IFilterReadRequest = decodeState(routeSearch.s) as IFilterReadRequest;

  const query: IFilterReadRequest = search ? {
    ...search,
    userId: user?.id || "",
    pagination: {
      ...search.pagination,
      pageNumber: search.pagination.pageNumber ? search.pagination.pageNumber : DefaultFilterRead.pagination.pageNumber
    }
  } : {
    ...DefaultFilterRead, userId: user?.id || ""
  };
  let pageInfo = useRef({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize,
    totalRecords: 0,
  });

  const {
    isPending, isError, data, error
  }: UseQueryResult<IFilterReadResponse> = useQuery(filterGroupOptions(query));


  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q: IFilterReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageNumber: value
      }
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q: IFilterReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageSize: parseInt(e.target.value, 10), pageNumber: 0,
      }
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };

  function handleItemClick(it: IFilter) {
    const ct = it && it.name ? it.name : "";
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, tags: it.tags ? it.tags : [] },
      // query: { ...DefaultItemRead.query, filters: [ct] },
    };
    const encoded = encodeState(q);
    const encodedSrc = encodeState(it);
    const itemTitle = ct == "" ? "" : "Items in ##" + ct;
    navigate({
      to: "/items/{-$title}",
      search: { s: encoded, src: encodedSrc },
      params: { title: itemTitle }
    });
    store.setItemTitle(itemTitle);
    store.setItemReference(it);
    store.setDisplayFilter(it);
  }
  function eachItem(itemKey: number, item: IFilter): ReactNode {
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem
        key={itemKey + tc}
        component="div" disablePadding
        onClick={() => handleItemClick(item)}
      >
        <ListItemButton>
          <ListItemText primary={tc} />
          <Chip sx={{ background: "primary" }} label={item.count ? item.count.toString() : "0"} />
        </ListItemButton>
      </ListItem>
    );
  }



  let errMsg: string = isError && error && error instanceof Error ? error.message : "";
  try {
    ZFilterReadResponse.parse(data);
  } catch (error: any) {
    errMsg = "An error occurred. Please try again";
    if (error instanceof z.ZodError) {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.info("Zod issue - ", error.issues);
      }
    } else {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.info("Other issue - ", error);
      }
    }
  }

  const filters: IFilter[] = data && data.filters ? data.filters : [];
  if (data) {
    pageInfo.current = {
      pageSize: parseInt(data.pagination.pageSize as unknown as string, 10),
      totalRecords: parseInt(data.totalRecordCount as unknown as string, 10),
      pageNumber: data.pagination.pageNumber ? parseInt(data.pagination.pageNumber as unknown as string, 10) : query.pagination.pageNumber
    };
  }

  return (
    <Fragment>
      {
        isPending &&
        <OuterBox><LinearProgress /></OuterBox>
      }
      {
        !isPending && (isError || errMsg !== "") &&
        <OuterBox><ErrorAlert message={errMsg ? errMsg : error?.message || "An error occurred. Please try again"} /></OuterBox>
      }
      {
        !isError && !isPending && filters.length == 0 &&
        <OuterBox>
          <AppH6Typography sx={{ display: 'flex', textTransform: "none", justifyContent: "center", alignContent: "center", }}>
            No filters found
          </AppH6Typography>
        </OuterBox>
      }
      {
        filters.length > 0 && <Virtuoso key="data-content"
          style={ListBoxSize} data={filters}
          itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
        />
      }
      <TablePagination
        component="div"
        count={pageInfo.current.totalRecords}
        page={pageInfo.current.pageNumber}
        onPageChange={handlePageChange}
        rowsPerPage={pageInfo.current.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Fragment>
  );
}
