import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Fragment,
  useRef,
} from "react";
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
import { Virtuoso } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TablePagination from '@mui/material/TablePagination';


import type {
  IItem,
  IItemReadRequest,
  IItemReadResponse,
  // IItemRouteSearch,
} from "@/lib/model/item";
import {
  ZItemReadResponse,
} from "@/lib/model/item";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';

import {
  itemGroupOptions,

} from '@/lib/helper/querying';
import { ErrorAlert } from "@/components/core/Alerts";
import {
  encodeState
} from '@/lib/helper/encoders';
import {
  AppH6Typography,
  AppListItemTypography,
} from "@/components/core/Typography";
import LinearProgress from '@mui/material/LinearProgress';
import {
  ListBoxSize,
} from '@/lib/helper/defaults';






export function ItemListLayout(): ReactNode {
  const navigate = useNavigate();
  const store: TBoundStore = useBoundStore((state) => state);

  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  const routeApi = getRouteApi('/items/');
  const { search } = routeApi.useRouteContext();
  const { query, title, reference } = search;

  let pageInfo = useRef({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize,
    totalRecords: 0,
  });


  const {
    isPending, isFetching, isError, data, error
  }: UseSuspenseQueryResult<IItemReadResponse> = useSuspenseQuery(itemGroupOptions(query));

  let errMsg: string = isError && error && error instanceof Error ? error.message : "";
  try {
    ZItemReadResponse.parse(data);
  } catch (error) {
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

  const items: IItem[] = data && data.items ? data.items : [];
  if (data) {
    pageInfo.current = {
      pageSize: parseInt(data.pagination.pageSize as unknown as string, 10),
      totalRecords: parseInt(data.totalRecordCount as unknown as string, 10),
      pageNumber: data.pagination.pageNumber ? parseInt(data.pagination.pageNumber as unknown as string, 10) : query.pagination.pageNumber
    };
  }

  // if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  //   console.info("store title - ", store.itemTitle);
  //   console.info("store reference - ", store.itemReference);
  // }

  function getRouteSearch(qs: IItemReadRequest) {
    const s = {
      query: qs, title, reference: reference || undefined,
    }
    return encodeState(s);
  }

  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q = {
      ...query, pagination: { ...query.pagination, pageNumber: value }
    };
    ;
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };

  function handleItemClick(anitem: IItem) {
    store.setDisplayItem(anitem);
    store.setItemModal(true);
  }

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q = {
      ...query,
      pagination: {
        ...query.pagination,
        pageSize: parseInt(e.target.value, 10), pageNumber: 0
      }
    };
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };

  function eachItem(itemKey: number, item: IItem): ReactNode {
    let dis: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + item.id}
          // component="div"
          disablePadding
          disableGutters
          sx={{ p: 0, m: 0 }}
          onClick={() => handleItemClick(item)}>
          <ListItemButton >
            <ListItemText
              primary={
                <AppListItemTypography sx={{ p: 0, m: 0 }}>{dis}</AppListItemTypography>
              }
            />
          </ListItemButton>
        </ListItem>

      </Fragment>
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
  // ToDo: Tags should be predefined in the UI so adding new tags via add items would not be possible


  if (isPending || isFetching) {
    return <ListBox> <OuterBox><LinearProgress /></OuterBox></ListBox>
  }

  if (isError || errMsg !== "") {
    return <ListBox><OuterBox><ErrorAlert message={errMsg ? errMsg : error?.message || "An error occurred. Please try again"} /></OuterBox></ListBox>
  }

  if (items.length == 0) {
    return <ListBox><OuterBox>
      <AppH6Typography sx={{ display: 'flex', textTransform: "none", justifyContent: "center", alignContent: "center", }}>
        No tags found
      </AppH6Typography>
    </OuterBox></ListBox>
  }

  if (items.length > 0) {
    return <ListBox><Virtuoso key="data-content"
      style={ListBoxSize} data={items}
      itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
    /></ListBox>
  }
  return <ListBox><OuterBox><ErrorAlert message="An error occurred. Please try again" /></OuterBox></ListBox>
}
