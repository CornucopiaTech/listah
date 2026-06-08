import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Fragment,
  useRef,
  useEffect,
  useState,
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
// import { Virtuoso } from 'react-virtuoso';
import { Virtuoso, type VirtuosoHandle, type StateSnapshot } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';


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
  ListBoxSize,
} from '@/lib/helper/defaults';
import {
  CentredBox,
} from '@/components/core/AppBox';




// ToDo: Set the focus as part of the url params so it can be returned to in the backbutton or when modal closes. This prevents the focus to always return to the beginning of the page when the url is gone to.
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
      totalRecords: data.totalRecordCount ? parseInt(data.totalRecordCount as unknown as string, 10) : 1,
      pageNumber: data.pagination.pageNumber ? parseInt(data.pagination.pageNumber as unknown as string, 10) : query.pagination.pageNumber
    };
  }


  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  const scrollKey = `vscroll:${location.pathname}${location.search}`;
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [virtuosoState] = useState<StateSnapshot | undefined>(() => {
    const saved = sessionStorage.getItem(scrollKey);
    return saved ? JSON.parse(saved) : undefined;
  });
  useEffect(() => {
    if (virtuosoState) sessionStorage.removeItem(scrollKey);
  }, []);


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
    virtuosoRef.current?.getState((state: StateSnapshot) => {
      sessionStorage.setItem(scrollKey, JSON.stringify(state));
      store.setDisplayItem(anitem);
      store.setItemModal(true);
    });
  }

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const q = {
      ...query,
      pagination: {
        ...query.pagination,
        pageSize: parseInt(e.target.value, 10), pageNumber: 1
      }
    };
    navigate({ to: ".", search: { s: getRouteSearch(q) }, });
  };

  function eachItem(itemKey: number, item: IItem): ReactNode {
    let tc: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + item.id}
          // component="div"
          disablePadding
          disableGutters
          onClick={() => handleItemClick(item)}>
          <ListItemButton >
            <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
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

  // ToDo: Tags should be predefined in the UI so adding new tags via add items would not be possible


  if (isPending || isFetching) {
    return <ListBox> <OuterBox><LinearProgress /></OuterBox></ListBox>
  }

  if (isError || errMsg !== "") {
    return <ListBox><OuterBox><ErrorAlert message={errMsg ? errMsg : error?.message || "An error occurred. Please try again"} /></OuterBox></ListBox>
  }

  if (items.length == 0) {
    return <ListBox><OuterBox>
      <Typography variant="h6"> No items found </Typography>
    </OuterBox></ListBox>
  }

  if (items.length > 0) {
    return <ListBox>
      <Virtuoso key="data-content"
        ref={virtuosoRef}
        restoreStateFrom={virtuosoState}
        style={ListBoxSize} data={items}
        itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
      />
    </ListBox>
  }
  return <ListBox><OuterBox><ErrorAlert message="An error occurred. Please try again" /></OuterBox></ListBox>
}
