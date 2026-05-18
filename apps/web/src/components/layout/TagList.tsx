

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
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";
import {
  useNavigate,
  getRouteApi,
} from '@tanstack/react-router';
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
  encodeState
} from '@/lib/helper/encoders';
import {
  DefaultItemRead,
  ListBoxSize,
} from '@/lib/helper/defaults';
import {
  AppH6Typography,
  AppListItemTypography,
} from "@/components/core/Typography";





export function TagListLayout(): ReactNode {
  const navigate = useNavigate();
  const store: TBoundStore = useBoundStore((state) => state);
  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  // const routeSearch: ITagReadRequest = routeApi.useSearch() ### Do not use this.
  const routeApi = getRouteApi('/tags/');
  const { search: query } = routeApi.useRouteContext();

  let pageInfo = useRef({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize,
    totalRecords: 0,
  });

  const {
    isPending, isError, data, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useSuspenseQuery(tagGroupOptions(query))

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
    const pageTitle = it && it.name ? `#${it.name}` : "Tags";
    const pageTags = it && it.id ? [it.id] : [];
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, tags: pageTags },
    };
    const s = { query: q, title: pageTitle, refTag: it, }
    const encoded = encodeState(s);

    navigate({ to: "/items", search: { s: encoded }, });
    store.setItemTitle(pageTitle);
    store.setItemReference(it);
    store.setDisplayTag(it);
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
            <AppListItemTypography sx={{ p: 0, m: 0, }}>{tc}</AppListItemTypography>
          } />
          <Chip sx={{ background: "primary" }} label={item.count ? item.count.toString() : "0"} />
        </ListItemButton>
      </ListItem>
    );
  }

  function OuterBox({ children }: { children: ReactNode }): ReactNode {
    return (
      <Fragment>
        <Box key="data-content" sx={ListBoxSize}>
          {children}
        </Box>
      </Fragment>
    );
  }

  function ListBox({ children }: { children: ReactNode }): ReactNode {
    return (
      <Fragment>
        {children}
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

  if (isPending) {
    return <ListBox> <OuterBox><LinearProgress /></OuterBox></ListBox>
  }

  if (isError || errMsg !== "") {
    return <ListBox><OuterBox><ErrorAlert message={errMsg ? errMsg : error?.message || "An error occurred. Please try again"} /></OuterBox></ListBox>
  }

  if (tags.length == 0) {
    return <ListBox><OuterBox>
      <AppH6Typography sx={{ display: 'flex', textTransform: "none", justifyContent: "center", alignContent: "center", }}>
        No tags found
      </AppH6Typography>
    </OuterBox></ListBox>
  }

  if (tags.length > 0) {
    return <ListBox><Virtuoso key="data-content"
      style={ListBoxSize} data={tags}
      itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
    /></ListBox>
  }
  return <ListBox><OuterBox><ErrorAlert message="An error occurred. Please try again" /></OuterBox></ListBox>
}
