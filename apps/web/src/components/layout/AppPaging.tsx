

import type {
  ReactNode,
} from 'react';
import {
  Fragment,
} from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import { useTheme, useMediaQuery, Typography } from '@mui/material';



import {
  PaginationMenu,
} from '@/domain/entities';
import {
  ListBoxSize,
  ViewListBoxSize,
} from '@/helpers/defaults';
import {
  CentredBox,
  AppCentredPagination,
} from '@/components';
import {
  usePaging
} from "@/hooks/context";
import type {
  IPagingContext,
} from "@/domain/entities"




export function OuterBox({ children }: { children: ReactNode }): ReactNode {
  const sx = {
    ...ListBoxSize, /*Binds the vertical size */
    overflowY: 'auto', /* Enables scrolling when content overflows*/
  }
  return (<Box key="data-content" sx={sx} > {children} </Box>);
}


export function ViewOuterBox({ children }: { children: ReactNode }): ReactNode {
  const sx = {
    ...ViewListBoxSize, /*Binds the vertical size */
    overflowY: 'auto', /* Enables scrolling when content overflows*/
  }
  return (<Box key="data-content" sx={sx} > {children} </Box>);
}


export function PrevListBox({ children }: { children: ReactNode }): ReactNode {
  const {
    pagination,
    pageChange,
    pageSizeChange,
  } = usePaging() as unknown as IPagingContext;
  const totalPages = Math.max(1, Math.ceil(pagination.volume / pagination.size));
  return (
    <Fragment>
      <Stack spacing={0}>
        {children}
        <Divider />
        <CentredBox sx={{ height: "100px" }}>
          <CentredBox sx={{ maxWidth: 100, marginRight: 0 }}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="demo-simple-select-label">Rows</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={pagination.size}
                label="rows-per-page"
                //  @ts-ignore
                onChange={pageSizeChange}
                sx={{
                  height: 36,                     // overall component height
                  '& .MuiSelect-select': {
                    paddingY: 1.2,                // vertical padding
                  },
                }}
              >
                {PaginationMenu.map((i, _) => <MenuItem value={i.value}>{i.label}</MenuItem>)}
              </Select>
            </FormControl>
          </CentredBox>
          <AppCentredPagination
            sx={{ height: "fit-content", padding: 1 }}
            page={pagination.page}
            count={totalPages}
            color="primary"
            //  @ts-ignore
            onChange={pageChange}
            siblingCount={0} // Number of pages shown on each side of the current page
            boundaryCount={0} // Number of pages shown at the start and end
          />
        </CentredBox>
      </Stack >
    </Fragment >
  );
}

export function ListBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Fragment>
      <Stack spacing={0}>
        {children}
        <Divider />
        <AppListPagination />
      </Stack >
    </Fragment >
  );
}


export function AppListPagination(): ReactNode {
  const {
    pagination,
    pageChange,
    pageSizeChange,
  } = usePaging() as unknown as IPagingContext;
  const totalPages = Math.max(1, Math.ceil(pagination.volume / pagination.size));
  const beginNumber = pagination.size * (pagination.page - 1);
  const endNumber = Math.min(
    pagination.size * (pagination.page),
    pagination.volume
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Stack direction="row" spacing={{ xs: 1, md: 6 }}
      sx={{
        height: "80px", justifyContent: 'center', alignContent: 'center',
        display: 'flex', width: '100%', flexWrap: 'wrap',
        alignItems: 'center'
      }}>
      <Typography sx={{ display: isMobile ? "none" : undefined }}>
        {beginNumber} - {endNumber} of {pagination.volume}
      </Typography>
      <FormControl sx={{}}>
        <InputLabel id="demo-simple-select-label">Rows</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={pagination.size}
          label="rows-per-page"
          //  @ts-ignore
          onChange={pageSizeChange}
          sx={{
            // height: 36,                     // overall component height
            height: "fit-content",                     // overall component height
            '& .MuiSelect-select': {
              paddingY: 1.2,                // vertical padding
            },
          }}
        >
          {PaginationMenu.map((i, _) => <MenuItem value={i.value}>{i.label} {isMobile ? "" : "/ page"}</MenuItem>)}
        </Select>
      </FormControl>
      <Pagination
        sx={{ height: "fit-content", padding: 1 }}
        page={pagination.page}
        count={totalPages}
        color="primary"
        //  @ts-ignore
        onChange={pageChange}
        boundaryCount={isMobile ? 0 : 1} // Recommended: adjust sibling count or size dynamically as well
        siblingCount={isMobile ? 0 : 1}
        size={isMobile ? 'small' : 'medium'}
      />
    </Stack >
  );
}
