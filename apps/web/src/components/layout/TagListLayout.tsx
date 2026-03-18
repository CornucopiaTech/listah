

import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Fragment,
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
  THomeQueryParams
} from '@/lib/model/home';
import type {
  ITagCategory,
  ITagCategoryReadResponse,
} from "@/lib/model/tag";
import {
  ZTagCategoryReadResponse,
} from "@/lib/model/tag";
import { tagGroupOptions } from '@/lib/helper/querying';
import { ErrorAlert } from "@/components/core/Alerts";
import {
  decodeState,
  encodeState
} from '@/lib/helper/encoders';
import { DefaultQueryParams } from '@/lib/helper/defaults';
import { AppH6Typography } from "@/components/core/Typography";



function OuterBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Fragment>
      <Box key="data-content" sx={{ height: `calc(100vh - 300px)`, width: '100%', }}>
        {children}
      </Box>
    </Fragment>

  );
}

export function TagListLayout(): ReactNode {
  const routeApi = getRouteApi('/');
  const routeSearch: { s: string } = routeApi.useSearch()
  let search = decodeState(routeSearch.s) as THomeQueryParams;
  const navigate = useNavigate();
  const { user, } = useUser();


  const query: THomeQueryParams = {
    savedFilter: { ...search.savedFilter, userId: user?.id || "" },
    tag: { ...search.tag, userId: user?.id || "" }
  }

  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagCategoryReadResponse> = useQuery(tagGroupOptions(query.tag));



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
      tag: { ...query.tag, pageSize: parseInt(e.target.value, 10), pageNumber: 0, }
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handleItemClick(it: ITagCategory) {
    console.log("In handleItemclick");
    const ct = it && it.category ? it.category : "";
    const q: IItemReadRequest = {
      ...DefaultQueryParams,
      userId: query.tag.userId,
      tags: [ct],
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/items/$title", search: { s: encoded }, params: { title: it.category } });
  }

  function eachItem(itemKey: number, item: ITagCategory): ReactNode {
    const tc: string = item.category ? item.category : ""
    return (
      <ListItem
        key={itemKey + tc}
        component="div" disablePadding
        onClick={() => handleItemClick(item)}
      >
        <ListItemButton>
          <ListItemText primary={tc} />
          <Chip sx={{ background: "primary" }} label={item.rowCount} />
        </ListItemButton>
      </ListItem>
    );
  }


  let errMsg: string = isError && error && error instanceof Error ? error.message : "";
  try {
    ZTagCategoryReadResponse.parse(data);
  } catch (error: any) {
    errMsg = "An error occurred. Please try again";
    if (error instanceof z.ZodError) {
      console.info("Zod issue - ", error.issues);
    } else {
      console.info("Other issue - ", error);
    }
  }

  const totalRecords: number = data && data.pageSize ? data.pageSize : 1;
  const categories: ITagCategory[] = data && data.categories ? data.categories : [];



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
        !isError && !isPending && categories.length == 0 &&
        <OuterBox><AppH6Typography> No items found </AppH6Typography></OuterBox>
      }
      {
        categories.length > 0 && <Virtuoso key="data-content"
          style={{ height: `calc(100vh - 300px)`, width: '100%', }}
          data={categories}
          itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
        />
      }

      <TablePagination
        component="div"
        count={totalRecords} page={query.tag.pageNumber}
        onPageChange={handlePageChange}
        rowsPerPage={query.tag.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Fragment>
  );
}
