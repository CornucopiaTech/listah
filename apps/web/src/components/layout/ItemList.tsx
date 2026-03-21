import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { Fragment } from "react";
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
import Checkbox from '@mui/material/Checkbox';


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

import { itemGroupOptions } from '@/lib/helper/querying';
import { ErrorAlert } from "@/components/core/Alerts";
import {
  decodeState,
  encodeState
} from '@/lib/helper/encoders';

import { AppH6Typography } from "@/components/core/Typography";
import LinearProgress from '@mui/material/LinearProgress';
import {
  DefaultItemRead,
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

export function ItemListLayout(): ReactNode {
  const routeApi = getRouteApi('/items/$title');
  const routeSearch: { s: string } = routeApi.useSearch()
  let search: IItemReadRequest = decodeState(routeSearch.s) as IItemReadRequest;
  const navigate = useNavigate();
  const { user, } = useUser();
  const title = useParams({ strict: false }).title;
  const store: TBoundStore = useBoundStore((state) => state);

  const query: IItemReadRequest = { ...search, userId: user?.id || "" };

  const {
    isPending, isError, data, error
  }: UseQueryResult<IItemReadResponse> = useQuery(itemGroupOptions(query));


  let errMsg: string = isError && error && error instanceof Error ? error.message : "";
  try {
    ZItemReadResponse.parse(data);
  } catch (error) {
    errMsg = "An error occurred. Please try again";
    if (error instanceof z.ZodError) {
      console.info("Zod issue - ", error.issues);
    } else {
      console.info("Other issue - ", error);
    }
  }




  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    navigate({
      to: "/items/$title",
      search: { s: encoded },
      params: { title: title || "" }
    });
  };

  function handleItemClick(anitem: IItem) {
    const itId: string = anitem && anitem.id ? anitem.id : ""
    store.setDisplayId(itId);
    store.setDisplayItem(anitem);
    store.setItemModal(true);
  }

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q = { ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0 };
    const encoded = encodeState(q);
    navigate({
      to: "/items/$title",
      search: { s: encoded },
      params: { title: title || "" }
    });
  };

  function eachItem(itemKey: number, item: IItem): ReactNode {
    let dis: string = item.name ? item.name : "";
    return (
      <Fragment>
        {
          !store.selectMode &&
          <ListItem key={itemKey + dis}
            component="div" disablePadding
            onClick={() => handleItemClick(item)}>
            <ListItemButton>
              <ListItemText primary={dis} />
            </ListItemButton>
          </ListItem>
        }
        {
          store.selectMode && <ListItem key={itemKey + dis}
            component="div" disablePadding >
            <ListItemButton>
              <ListItemText primary={dis} />
              <Checkbox checked={true}
                onChange={() => store.setSelectMode(!store.selectMode)} size="small" />
            </ListItemButton>
          </ListItem>
        }
      </Fragment>
    );
  }

  const items: IItem[] = data && data.items ? data.items : [];
  const totalRecords: number = data && data.pagination && data.pagination.pageSize ? data.pagination.pageSize : 1;

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
        items.length > 0 && <Virtuoso key="data-content"
          style={ListBoxSize} data={items}
          itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
        />
      }
      {
        !isError && !isPending && items.length == 0 &&
        <OuterBox><AppH6Typography> No items found </AppH6Typography></OuterBox>
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
