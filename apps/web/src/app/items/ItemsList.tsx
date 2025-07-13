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


import type { IProtoItems } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import Loading from '@/components/Loading';


async function fetchData(aurl: string, atraceparent: string, auserId: string, acategory: string | string [], atags: string[]) {
  console.info(`In React Query - traceparent: ${atraceparent}`);
  const req = new Request(aurl, {
    method: "POST",
    body: JSON.stringify({ items: [{ userId: auserId, category: acategory, tags: atags }] }),
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
  traceparent: string, url: string
}) {
  // console.info(`Traceparent In Client: ${traceparent}`);
  // console.info(`Url In Client: ${url}`);
  const recordsPerPage = 20;
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const itemsKey = "itemsListing";
  const userId = "4b4b6b2d-f453-496c-bbb2-4371362f386d";
  const category = "";
  const tags: string[] = [];


  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery({
    queryKey: [itemsKey, url, traceparent, userId, category, tags],
    queryFn: () => fetchData(url, traceparent, userId, category, tags)
  });


  console.info(`isPending: ${isPending}\t isError: ${isError}\t data: ${data}\t error ${error}`);
  if (isPending) { return <Loading />; }

  if (isError) {
    return <ErrorAlerts>Unable to retrieve data from API. Error: {error.message}</ErrorAlerts>;
  }

  return (
    <React.Fragment>
      <Box sx={{ height: '100%', bgcolor: 'paper', }}>
        <Box key='top-pagination'
          sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
          <Stack spacing={2} >
            <Pagination count={Math.ceil(data.items.length / recordsPerPage)}
              page={page} onChange={handleChange} />
          </Stack>
        </Box>

        <Box sx={{
          width: '100%', display: 'grid', gap: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        }} >
          {data.items.slice((page - 1) * recordsPerPage, page * recordsPerPage).map((val, _) => (
            <Paper key={val.id + "-content"}>
              <Box key={val.id} sx={{ maxHeight: 360, p: 1.5, }}>
                <Typography key='link' variant="body1" component="div" sx={{ p: 0.6, }}>
                  <Link color="text.primary" href={`/item/${val.id}`}>
                    {val.summary.length > 80 ? val.summary.substr(0, 80) + '...' : val.summary}
                  </Link>
                </Typography>
                <Typography key='description' component="div" variant="caption"
                  color="text.secondary" sx={{ p: 0.6, }}>
                  {val.description.substr(0, Math.max(180 - val.summary.length, 80)) + '...'}
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

        <Box key='bottom-pagination'
          sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
          <Stack spacing={2} >
            <Pagination count={Math.ceil(data.items.length / recordsPerPage)} page={page} onChange={handleChange} />
          </Stack>
        </Box>
      </Box>
    </React.Fragment>

  );

}
