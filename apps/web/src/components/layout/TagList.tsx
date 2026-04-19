

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




import type { IItemReadRequest } from '@/lib/model/item';
import type {
  ITag,
  ITagReadRequest,
  ITagReadResponse,
} from "@/lib/model/tag";
import {
  ZTagReadResponse,
} from "@/lib/model/tag";
import { tagGroupOptions } from '@/lib/helper/querying';
import { ErrorAlert } from "@/components/core/Alerts";
import {
  decodeState,
  encodeState
} from '@/lib/helper/encoders';
import {
  DefaultItemRead,
  DefaultTagRead,
  ListBoxSize,
} from '@/lib/helper/defaults';
import {
  AppH6Typography,
  AppBody1Typography,
} from "@/components/core/Typography";



function OuterBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Fragment>
      <Box key="data-content" sx={ListBoxSize}>
        {children}
      </Box>
    </Fragment>
  );
}

export function TagListLayout(): ReactNode {
  const routeApi = getRouteApi('/tags/{-$title}');
  const routeSearch: { s: string } = routeApi.useSearch()
  let search = decodeState(routeSearch.s) as ITagReadRequest;
  const navigate = useNavigate();
  const { user, } = useUser();


  const query: ITagReadRequest = search ? {
    ...search,
    userId: user?.id || "",
    pagination: {
      ...search.pagination,
      pageNumber: search.pagination.pageNumber ? search.pagination.pageNumber : DefaultTagRead.pagination.pageNumber
    }
  } : {
    ...DefaultTagRead, userId: user?.id || ""
  };
  let pageInfo = useRef({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize,
    totalRecords: 0,
  });

  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useQuery(tagGroupOptions(query));

  const tags: ITag[] = data && data.tags ? data.tags : [];
  if (data) {
    pageInfo.current = {
      pageSize: parseInt(data.pagination.pageSize as unknown as string, 10),
      totalRecords: parseInt(data.totalRecordCount as unknown as string, 10),
      pageNumber: data.pagination.pageNumber ? parseInt(data.pagination.pageNumber as unknown as string, 10) : query.pagination.pageNumber
    };
  }


  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q: ITagReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageNumber: value
      }
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q: ITagReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageSize: parseInt(e.target.value, 10), pageNumber: 0,
      }
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };

  function handleItemClick(it: ITag) {
    const ct = it && it.name ? it.name : "";
    const cti = it && it.id ? it.id : "";
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, tags: [cti] },
    };
    const encoded = encodeState(q);
    navigate({ to: "/items/{-$title}", search: { s: encoded }, params: { title: `Items in #${ct}` } });
  }

  function eachItem(itemKey: number, item: ITag): ReactNode {
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem
        key={itemKey + tc}
        component="div" disablePadding
        onClick={() => handleItemClick(item)}
      >
        <ListItemButton>
          <ListItemText primary={
            <AppBody1Typography sx={{ p: 0 }}>{tc}</AppBody1Typography>
          } />
          <Chip sx={{ background: "primary" }} label={item.count ? item.count.toString() : "0"} />
        </ListItemButton>
      </ListItem>
    );
  }


  let errMsg: string = isError && error && error instanceof Error ? error.message : "";
  try {
    ZTagReadResponse.parse(data);
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



  return (
    <Fragment>
      {
        isPending &&
        <OuterBox><LinearProgress /></OuterBox>
      }
      {
        !isPending && (isError || errMsg !== "") && tags.length == 0 &&
        <OuterBox><ErrorAlert message={errMsg ? errMsg : error?.message || "An error occurred. Please try again"} /></OuterBox>
      }
      {
        !isError && !isPending && tags.length == 0 &&
        <OuterBox><AppH6Typography> No items found </AppH6Typography></OuterBox>
      }
      {
        tags.length > 0 && <Virtuoso key="data-content"
          style={ListBoxSize} data={tags}
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
