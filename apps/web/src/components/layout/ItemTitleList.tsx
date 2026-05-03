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
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";
import {
  useNavigate,
  getRouteApi,
  useParams
} from '@tanstack/react-router';
import Box from '@mui/material/Box';
import { useUser } from '@clerk/react';
import { Virtuoso } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TablePagination from '@mui/material/TablePagination';


import type {
  IItem,
  IItemReadRequest,
  IItemReadResponse,
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
  decodeState,
  encodeState
} from '@/lib/helper/encoders';
import { DefaultItemRead } from '@/lib/helper/defaults';
import {
  AppH6Typography,
  AppBody1Typography,
} from "@/components/core/Typography";
import LinearProgress from '@mui/material/LinearProgress';
import {
  ListBoxSize,
} from '@/lib/helper/defaults';




function OuterBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Fragment>
      <Box key="data-content" sx={ListBoxSize}>
        {children}
      </Box>
    </Fragment>
  );
}


export function ItemTitleListLayout(): ReactNode {
  const navigate = useNavigate();
  const { user, } = useUser();
  const title = useParams({ strict: false }).title;
  const store: TBoundStore = useBoundStore((state) => state);


  const routeApi = getRouteApi('/items/{-$title}');
  const routeSearch: { s: string } = routeApi.useSearch()
  let search: IItemReadRequest = decodeState(routeSearch.s) as IItemReadRequest;

  const query: IItemReadRequest = search ? {
    ...search,
    userId: user?.id || "",
    pagination: {
      ...search.pagination,
      pageNumber: search.pagination.pageNumber ? search.pagination.pageNumber : DefaultItemRead.pagination.pageNumber
    }
  } : {
    ...DefaultItemRead, userId: user?.id || ""
  };
  let pageInfo = useRef({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize,
    totalRecords: 0,
  });


  const {
    isPending, isFetching, isError, data, error
  }: UseQueryResult<IItemReadResponse> = useQuery(itemGroupOptions(query));

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

  if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
    console.info("store title - ", store.itemTitle);
    console.info("store reference - ", store.itemReference);
  }


  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q = {
      ...query, pagination: { ...query.pagination, pageNumber: value }
    };
    const encoded = encodeState(q);
    navigate({
      to: ".",
      search: { s: encoded },
      params: { title: title || "" }
    });
  };

  function handleItemClick(anitem: IItem) {
    const itId: string = anitem && anitem.id ? anitem.id : "";
    store.setDisplayId(itId);
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
    const encoded = encodeState(q);
    navigate({
      to: ".",
      search: { s: encoded },
      params: { title: title || "" }
    });
  };

  function eachItem(itemKey: number, item: IItem): ReactNode {
    let dis: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + dis}
          // component="div"
          disablePadding
          sx={{ p: 0, m: 0 }}
          onClick={() => handleItemClick(item)}>
          <ListItemButton >
            <ListItemText
              primary={
                <AppBody1Typography sx={{ p: 0 }}>{dis}</AppBody1Typography>
              }
            />
          </ListItemButton>
        </ListItem>

      </Fragment>
    );
  }


  // ToDo: Tags should be predefined in the UI so adding new tags via add items would not be possible
  return (
    <Fragment>
      {
        (isPending || isFetching) &&
        <OuterBox><LinearProgress /></OuterBox>
      }
      {
        !isPending && !isFetching && (isError || errMsg !== "") && items.length == 0 &&
        <OuterBox>
          <ErrorAlert message={errMsg ? errMsg : error?.message || "An error occurred. Please try again"} />
        </OuterBox>
      }
      {
        items.length > 0 && <Virtuoso key="data-content"
          style={ListBoxSize} data={items}
          itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
        />
      }
      {
        !isError && !isPending && !isFetching && items.length == 0 &&
        <OuterBox><AppH6Typography> No items found </AppH6Typography></OuterBox>
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
