



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
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';




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
import { encodeState } from '@/lib/helper/encoders';
import {
  DefaultItemRead,
  ListBoxSize,
} from '@/lib/helper/defaults';
import {
  CentredBox,
} from '@/components/core/AppBox';



export function FilterListLayout(): ReactNode {
  const navigate = useNavigate();
  const store: TBoundStore = useBoundStore((state) => state);
  // routeApi.useSearch() only contains data from validate search and does not contain the information that was injected into the route loader from the context. So the search information retrieved from routeApi.useSearch() will not contain the user information.
  const routeApi = getRouteApi('/filters/');
  const { search: query } = routeApi.useRouteContext();

  let pageInfo = useRef({
    pageNumber: query.pagination.pageNumber,
    pageSize: query.pagination.pageSize,
    totalRecords: 0,
  });

  const {
    isPending, isError, data, error
  }: UseSuspenseQueryResult<IFilterReadResponse> = useSuspenseQuery(filterGroupOptions(query));


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
      totalRecords: data.totalRecordCount ? parseInt(data.totalRecordCount as unknown as string, 10) : 1,
      pageNumber: data.pagination.pageNumber ? parseInt(data.pagination.pageNumber as unknown as string, 10) : query.pagination.pageNumber
    };
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
    navigate({ to: ".", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q: IFilterReadRequest = {
      ...query, pagination: {
        ...query.pagination, pageSize: parseInt(e.target.value, 10), pageNumber: 1,
      }
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded } });
  };

  function handleItemClick(idx: number, it: IFilter) {
    const pageTitle = it && it.name ? `##${it.name}` : "Filters";
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
      query: { ...DefaultItemRead.query, tags: it.tags ? it.tags : [] },
    };
    const s = { query: q, title: pageTitle, refFilter: it, }
    const encoded = encodeState(s);

    navigate({ to: "/items", search: { s: encoded }, });
    store.setItemTitle(pageTitle);
    store.setItemReference(it);
    store.setDisplayFilter(it);
    store.setFilterScroll(idx);
  }

  function eachItem(itemKey: number): ReactNode {
    const item: IFilter = filters[itemKey];
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem
        key={itemKey + tc}
        component="div" disablePadding
        onClick={() => handleItemClick(itemKey, item)}
      >
        <ListItemButton>
          <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          <Chip
            variant="contained"
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"}
            label={item.count ? item.count.toString() : "0"}
          />
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
    const totalPages = Math.max(1, Math.ceil(pageInfo.current.totalRecords / pageInfo.current.pageSize));
    return (
      <Fragment>
        <Stack spacing={0}>
          {children}
          <Divider />
          <CentredBox>
            <CentredBox sx={{ maxWidth: 100, marginRight: 0 }}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label">Rows</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={pageInfo.current.pageSize}
                  label="rows-per-page"
                  //  @ts-ignore
                  onChange={handlePageSizeChange}
                >
                  <MenuItem value={200}>200</MenuItem>
                  <MenuItem value={500}>500</MenuItem>
                  <MenuItem value={1000}>1000</MenuItem>
                  <MenuItem value={-1}>All</MenuItem>
                </Select>
              </FormControl>
            </CentredBox>
            <Pagination sx={{
              justifyContent: 'center', alignContent: 'center',
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'center'
            }}
              page={pageInfo.current.pageNumber}
              count={totalPages}
              color="primary"
              //  @ts-ignore
              onChange={handlePageChange}
            />
          </CentredBox>
        </Stack >
      </Fragment >
    );
  }

  if (isPending) {
    return <ListBox> <OuterBox><LinearProgress /></OuterBox></ListBox>
  }

  if (isError || errMsg !== "") {
    return <ListBox><OuterBox>
      <Alert severity="error"> {errMsg ? errMsg : error?.message || "An error occurred. Please try again"}</Alert>
    </OuterBox></ListBox>
  }

  if (filters.length == 0) {
    return <ListBox><OuterBox>
      <Typography variant="h6" >No filters found</Typography>
    </OuterBox></ListBox>
  }

  const scrollIdx = Math.max(0, Math.min(store.filterScroll - 5, store.filterScroll));

  if (filters.length > 0) {
    return <ListBox>
      <Virtuoso
        key="data-content"
        style={ListBoxSize}
        initialTopMostItemIndex={scrollIdx}
        totalCount={filters.length}
        itemContent={(ii) => eachItem(ii)}
      />
    </ListBox>
  }
  return <ListBox><OuterBox>
    <Alert severity="error"> "An error occurred. Please try again"</Alert>
  </OuterBox></ListBox>
}
