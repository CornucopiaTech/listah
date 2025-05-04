'use client'

let dynamic = 'force-dynamic';

// Receiving service
import {
  type Context,
  propagation,
  trace,
  Span,
  context,
} from '@opentelemetry/api';

import * as React from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  CssBaseline,
  Box,
  Paper,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Pagination,
  Stack,
  Link,
  LinearProgress,
  Skeleton,
  Chip,
} from '@mui/material';


import type { IProtoItems, IProtoItem } from '@/model/items';
import { getDemoItems } from '@/repository/fetcher';
import { fetchItems } from '@/repository/items';


export default function ItemsList() {

  const itemsKey = "itemsListing";
  const userId = "4b4b6b2d-f453-496c-bbb2-4371362f386d";
  const recordsPerPage = 20;

  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // let userId, tags, categories;

  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery({
    queryKey: [itemsKey, { traceId, userId, category: "", tags: [],}],
    queryFn: fetchItems
  });


  console.log(`isPending: ${isPending}\t isError: ${isError}\t data: ${data}\t error ${error}`);

  if (isPending) {
    return (
      <React.Fragment>
        <LinearProgress />
        <Skeleton variant="rectangular" width='80%' height='100%' />
      </React.Fragment>

  );
  }

  if (isError) {
    return <span>Error: {error.message}</span>
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
                  <Paper key='content'>
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



// Define an interface for the input object that includes 'traceparent' & 'tracestate'.
interface Carrier {
  traceparent?: string;
  tracestate?: string;
}


export function getItemsList(traceId: string) {
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const itemsKey = "itemsListing";
  const userId = "4b4b6b2d-f453-496c-bbb2-4371362f386d";
  const recordsPerPage = 20;

  // Create an output object that conforms to that interface.
  const output: Carrier = {};

  // Serialize the traceparent and tracestate from context into
  // an output object.
  //
  // This example uses the active trace context, but you can
  // use whatever context is appropriate to your scenario.
  propagation.inject(context.active(), output);



  // let userId, tags, categories;

  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery({
    queryKey: [itemsKey, { contextCarrier: output, userId, category: "", tags: [],}],
    queryFn: fetchItems
  });


  console.log(`isPending: ${isPending}\t isError: ${isError}\t data: ${data}\t error ${error}`);

  if (isPending) {
    return (
      <React.Fragment>
        <LinearProgress />
        <Skeleton variant="rectangular" width='80%' height='100%' />
      </React.Fragment>

  );
  }

  if (isError) {
    return <span>Error: {error.message}</span>
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
                  <Paper key='content'>
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
