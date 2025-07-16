"use client"

import * as React from 'react';
import Link from 'next/link'
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  Box,
  Paper,
  Typography,
  Pagination,
  Stack,
  // Link,
  Chip,
} from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


import type { IProtoItems } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import Loading from '@/components/Loading';


async function fetchData(aurl: string, atraceparent: string, auserId: string,
  acategory: string | string [], atags: string[], pageNum: number, pageCount: number) {
  const req = new Request(aurl, {
    method: "POST",
    body: JSON.stringify({
      items: [{ userId: auserId, category: acategory, tags: atags }],
      pagination: {pageNumber: pageNum, recordsPerPage: pageCount, sortCondition: {}}
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "traceparent": atraceparent,
    },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}


export default function ItemsList({ traceparent, url }: {
  traceparent: string, url: string, countUrl: string
}): React.ReactNode  {
  const recordsPerPage = 12;
  const [page, setPage] = React.useState(1);

  const itemsKey = "itemsListing";
  const userId = "5076cbfa-9fa5-4a8c-8a87-7e534011457a";
  const category = "";
  const tags: string[] = [];


   const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery({
     queryKey: [itemsKey, url, traceparent, userId, category, tags, page, recordsPerPage],
     queryFn: () => fetchData(url, traceparent, userId, category, tags, page, recordsPerPage)
   });

  if (isPending) { return <Loading />; }
  if (isError) {
    return <ErrorAlerts>Unable to retrieve data from API. Error: {error.message}</ErrorAlerts>;
  }

  const items: IProtoItems | unknown = data.items;
  const totalRecords: number | unknown = data.totalRecordCount;
  const maxPages = Math.ceil(totalRecords / recordsPerPage);

  if (items === undefined || items.length == 0){
    return(
      <React.Fragment>
        <Box sx={{ height: '100%', bgcolor: 'paper', }}>
          <Box sx={{
              width: '100%', display: 'grid', gap: 3,
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            }} >
            <Paper >
              <Box sx={{ maxHeight: 360, p: 1.5, }}>
              </Box>
            </Paper>
          </Box>

        </Box>
      </React.Fragment>
    );
  }

  const foreArrow = (
    <Tooltip title="Next Page" arrow>
      <IconButton>
        <ArrowForwardIosOutlinedIcon onClick={() => {setPage(Math.min(maxPages, page + 1))}}/>
      </IconButton>
    </Tooltip>
  );

  const backArrow = (
    <Tooltip title="Previous Page" arrow>
      <IconButton>
        <ArrowBackIosNewOutlinedIcon onClick={() => {setPage(Math.max(1, page - 1))}}/>
      </IconButton>
    </Tooltip>
  );

  const initPagination = (
    <Box  key='initPagination'
              sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
      {foreArrow}
    </Box>
  );

  const regPagination = (
    <Box  key='regPagination'
          sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
      {backArrow} {foreArrow}
    </Box>
  );

  const lastPagination = (
    <Box  key='lastPagination'
          sx={{ display: 'flex', justifyContent: 'flex-start', my: 2 }}>
      {backArrow}
    </Box>
  );

  return (
    <React.Fragment>
      <Box sx={{ height: '100%', bgcolor: 'paper', }}>
        <Box  key='top-pagination'>
          {page == 1 && initPagination}
          {1 < page && page < maxPages && regPagination}
          {page == maxPages && lastPagination}
        </Box>

        <Box key="data-content" sx={{
            width: '100%', display: 'grid', gap: 3,
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          }} >
          {items.map((val, _) => (
            <Paper key={val.id + "-content"}>
              <Box key={val.id} sx={{ maxHeight: 360, p: 1.5, }}>
                <Typography key='link' variant="body1" component="div" sx={{ p: 0.6, }}>
                  <Link color="text.primary" href={`/item/${val.id}`}>
                    {val.summary.length > 80 ? val.summary.substring(0, 80) + '...' : val.summary}
                  </Link>
                </Typography>
                <Typography key='description' component="div" variant="caption"
                  color="text.secondary" sx={{ p: 0.6, }}>
                  {val.description.substring(0, Math.max(180 - val.summary.length, 80)) + '...'}
                </Typography>
                <Typography key='category' component="div" variant="body1" color="text.secondary"
                  sx={{ p: 1, textTransform: 'capitalize' }}>
                  {val.category}
                </Typography>
                {
                  val.tags.length > 0 ? (
                    val.tags.map((tag, index) => (
                      <Chip
                        key={tag + '-' + index}
                        label={tag}
                        size="small"
                        color="secondary"
                        sx={{ p: 0.5, m: 0.3, }}
                      />
                    ))
                  ) : ""
                }
              </Box>
            </Paper>
          ))}
        </Box>

        <Box  key='bottom-pagination'>
          {page == 1 && initPagination}
          {1 < page && page < maxPages && regPagination}
          {page == maxPages && lastPagination}
        </Box>
      </Box>
    </React.Fragment>
  );
}
