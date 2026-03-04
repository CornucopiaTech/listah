



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
import { useUser } from '@clerk/clerk-react';
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
  ISavedFilterCategory,
  ISavedFilterCategoryReadResponse,
} from "@/lib/model/savedFilter";
import {
  ZSavedFilterCategoryReadResponse,
} from "@/lib/model/savedFilter";
import { savedFilterGroupOptions } from '@/lib/helper/querying';
import { ErrorAlert} from "@/components/core/Alerts";
import { encodeState, decodeState } from '@/lib/helper/encoders';
import { DefaultQueryParams } from '@/lib/helper/defaults';
import { AppH6Typography } from "@/components/core/Typography";



function OuterBox( { children }: { children: ReactNode}): ReactNode {
  return (
    <Box key="data-content"
      sx={{
        height: `60vh`,
        width: '100%', display: 'block', overflow: 'auto',
      }}>
      {children}
    </Box>
  );
}
export function SavedFilterListLayout(): ReactNode {
  const routeApi = getRouteApi('/');
  const routeSearch = routeApi.useSearch()
  let search = decodeState(routeSearch.s) as THomeQueryParams;
  const navigate = useNavigate();
  const { user, } = useUser();

  const query = {
    savedFilter: { ...search.savedFilter, userId: user?.id || ""},
    tag: { ...search.tag, userId: user?.id || "" },
  }

  const {
    isPending, isError, data, error
  }: UseQueryResult<ISavedFilterCategoryReadResponse> = useQuery(savedFilterGroupOptions(query.savedFilter));





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
    const q: THomeQueryParams = {
      ...query,
      savedFilter: {...query.savedFilter, pageSize: parseInt(e.target.value, 10), pageNumber: 0,}
    };
    const encoded = encodeState(q);
    navigate({ to: "/", search: { s: encoded } });
  };

  function handleItemClick(it: ISavedFilterCategory) {
    const ct = it && it.id ? it.id : "";
    const q: IItemReadRequest = {
      ...DefaultQueryParams,
      userId: query.savedFilter.userId,
      savedFilters: [ct],
    };
    const encoded = encodeState(q);
    navigate({ to: "/items/$title", search: { s: encoded }, params: { title: it?.category || "" } });
  }
  function eachItem(itemKey: number, item: ISavedFilterCategory): ReactNode {
    const tc: string = item.category ? item.category : ""
    return (
      <ListItem
        style={{ height: 50, width: "100%", }} key={itemKey + tc}
        component="div" disablePadding
        onClick={() => handleItemClick(item) }
      >
        <ListItemButton>
          <ListItemText primary={tc} />
          <Chip sx={{background: "primary"}} label={item.rowCount ? item.rowCount.toString() : "0"} />
        </ListItemButton>
      </ListItem>
    );
  }



  let errMsg: string = isError && error && error instanceof Error ? error.message : "";
  try {
    ZSavedFilterCategoryReadResponse.parse(data);
  } catch (error: any) {
    errMsg = "An error occurred. Please try again";
    if (error instanceof z.ZodError) {
      console.info("Zod issue - ", error.issues);
    } else {
      console.info("Other issue - ", error);
    }
  }

  const totalRecords: number = data && data.pageSize ? data.pageSize : 1;
  const categories: ISavedFilterCategory[] = data && data.categories ? data.categories : [];

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
        categories.length > 0 && <Virtuoso key="data-content"
          style={{
            height: `65vh`, width: '100%', display: 'block', overflow: 'auto',
          }}
          data={categories}
          itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
        />
      }
      {
        !isError && !isPending &&categories.length == 0 &&
        <OuterBox><AppH6Typography> No items found </AppH6Typography></OuterBox>
      }

      <TablePagination
        component="div"
        count={totalRecords} page={query.savedFilter.pageNumber}
        onPageChange={handlePageChange}
        rowsPerPage={query.savedFilter.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />

    </Fragment>
  );
}
