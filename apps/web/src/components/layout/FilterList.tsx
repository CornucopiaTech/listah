



import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { Fragment } from "react";
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
  const routeApi = getRouteApi('/filters/');
  const routeSearch: { s: string } = routeApi.useSearch()
  let search = decodeState(routeSearch.s) as IFilterReadRequest;
  const navigate = useNavigate();
  const { user, } = useUser();

  const query: IFilterReadRequest = { ...search, userId: user?.id || "" }

  // const {
  //   isPending, isError, data, error
  // }: UseQueryResult<IFilterReadResponse> = useQuery(filterGroupOptions(query));
  const isPending: boolean = false;
  const isError: boolean = false;
  const data: IFilterReadResponse = {
    pagination: { pageSize: 8, pageNumber: 1, sort: "" },
    filters: [
      { id: "id 1", userId: query.userId, name: "filter name 1", tags: ["Tag 1"], count: 53 },
      { id: "id 2", userId: query.userId, name: "filter name 2", tags: ["Tag 1"], count: 153 },
      { id: "id 3", userId: query.userId, name: "filter name 3", tags: ["Tag 1"], count: 523 },
      { id: "id 5", userId: query.userId, name: "filter name 5", tags: ["Tag 1"], count: 33 },
      { id: "id 6", userId: query.userId, name: "filter name 6", tags: ["Tag 1"], count: 3 },
      { id: "id 7", userId: query.userId, name: "filter name 7", tags: ["Tag 1"], count: 43 },
      { id: "id 8", userId: query.userId, name: "filter name 8", tags: ["Tag 1"], count: 0 },
    ]
  }




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
    navigate({ to: "/filters", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q: IFilterReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageSize: parseInt(e.target.value, 10), pageNumber: 0,
      }
    };
    const encoded = encodeState(q);
    navigate({ to: "/filters", search: { s: encoded } });
  };

  function handleItemClick(it: IFilter) {
    const ct = it && it.name ? it.name : "";
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, filters: [ct] },
    };
    const encoded = encodeState(q);
    navigate({ to: "/items/$title", search: { s: encoded }, params: { title: ct } });
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
      console.info("Zod issue - ", error.issues);
    } else {
      console.info("Other issue - ", error);
    }
  }

  const totalRecords: number = data && data.pagination && data.pagination.pageSize ? data.pagination.pageSize : 1;
  const filters: IFilter[] = data && data.filters ? data.filters : [];

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
        <OuterBox><AppH6Typography> No items found </AppH6Typography></OuterBox>
      }
      {
        filters.length > 0 && <Virtuoso key="data-content"
          style={ListBoxSize} data={filters}
          itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
        />
      }
      <TablePagination
        component="div"
        count={totalRecords} page={query.pagination.pageNumber}
        onPageChange={handlePageChange}
        rowsPerPage={query.pagination.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Fragment>
  );
}
