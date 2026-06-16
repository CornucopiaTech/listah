

import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  Fragment,
} from "react";
import { Virtuoso } from 'react-virtuoso';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';




import type {
  IPagination,
} from '@/entities/common';
import {
  ListBoxSize,
} from '@/utils/defaults';
import {
  CentredBox,
} from '@/components/core/AppBox';
import {
  AppCentredPagination,
} from "@/components/core/Pagination";







export function OuterBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Fragment>
      <Box key="data-content" sx={ListBoxSize}>
        {children}
      </Box>
    </Fragment>
  );
}

export function ListBox({
  children, pagination, pageSizeChange, pageChange
}: {
  children: ReactNode,
  pagination: IPagination,
  pageSizeChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  pageChange?: (event: MouseEvent<HTMLButtonElement> | null,
    value: number) => void

}): ReactNode {
  const totalPages = Math.max(1, Math.ceil(pagination.totalRecords / pagination.pageSize));
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
                value={pagination.pageSize}
                label="rows-per-page"
                //  @ts-ignore
                onChange={pageSizeChange}
              >
                <MenuItem value={200}>200</MenuItem>
                <MenuItem value={500}>500</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={-1}>All</MenuItem>
              </Select>
            </FormControl>
          </CentredBox>
          <AppCentredPagination
            page={pagination.pageNumber}
            count={totalPages}
            color="primary"
            //  @ts-ignore
            onChange={pageChange}
          />
        </CentredBox>
      </Stack >
    </Fragment >
  );
}

export function ListLayout(
  {
    data, isPending, isFetching, error, scrollIndex, pagination,
    renderItem, pageSizeChange, pageChange,

  }: {
    data: any[],
    isPending: boolean,
    isFetching: boolean,
    isError: boolean,
    error: Error | null,
    scrollIndex: number,
    pagination: IPagination,
    renderItem: (i: number) => ReactNode,
    pageSizeChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    pageChange?: (event: MouseEvent<HTMLButtonElement> | null,
      value: number) => void
  }
): ReactNode {

  if (isPending || isFetching) {
    return (
      <ListBox pagination={pagination} >
        <OuterBox><LinearProgress /></OuterBox>
      </ListBox>
    )
  }

  if (error) {
    return (
      <ListBox pagination={pagination} >
        <OuterBox><Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert> </OuterBox>
      </ListBox>
    )
  }

  if (data.length == 0) {
    return (
      <ListBox pagination={pagination} >
        <OuterBox>
          <Typography variant="h6"> No items found </Typography>
        </OuterBox>
      </ListBox>
    )
  }


  if (data.length > 0) {
    return (
      <ListBox pagination={pagination} pageChange={pageChange} pageSizeChange={pageSizeChange}>
        <Virtuoso
          key="data-content"
          style={ListBoxSize}
          initialTopMostItemIndex={scrollIndex}
          totalCount={data.length}
          itemContent={(i) => renderItem(i)}
        />
      </ListBox>
    )
  }


  return (
    <ListBox pagination={pagination}>
      <OuterBox><Alert severity="error">"An error occurred. Please try again"</Alert> </OuterBox>
    </ListBox>
  )
}
