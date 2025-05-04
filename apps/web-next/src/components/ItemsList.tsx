'use client'

let dynamic = 'force-dynamic';

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
} from '@mui/material';


import type { ItemModelInterface } from '@/model/items';
import { getDemoItems } from '@/repository/fetcher';
import { fetchItems } from '@/repository/items';



const fetcher =  async (qKey) => {
  let url = process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ ? process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ : "";
  console.log(`A1. Request url: ${url}`)

  let reqUrl = url == "" ? "http://localhost:8080/listah.v1.ItemService/Read" : url
  console.log(`A1. Request reqUrl: ${reqUrl}`)


  console.log(`A1. Fetcher function Parameters: qKey`)
  console.log(qKey)
  const {queryKey} = qKey;
  const {userId, category, tags} = queryKey[1];
  console.log(`A1. function Parameters: u: ${userId}\t c: ${category}\t t:${tags}`)

  const reqBody = {
    items: [ {userId, category, tags}]
  }

  console.log(`A1. Request body: `);
  console.log(reqBody);


  // const theRequest = new Request(requrl, {
  //   method: "POST",
  //   body: JSON.stringify(reqBody),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

    // const res = await fetch(theRequest);
    const res = await fetch(
      reqUrl,
      {
      method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      },
    );
    console.log('A1. Fetch Items Response: ')
    console.log(res);
    return await res.json();

}

export default function ItemsList() {


  const items = getDemoItems([], [], []);

  // const requrl = process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ ? process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ : "";

  // console.log(`Request url in item Listing: ${requrl}`);


  const itemsKey = "itemsListing";
  const userId = "4b4b6b2d-f453-496c-bbb2-4371362f386d";
  const recordsPerPage = 18;

  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // let userId, tags, categories;

  const {isPending, isError, data, error}: UseQueryResult<ItemModelInterface> = useQuery({
    queryKey: [itemsKey, {itemsKey, userId, category: "", tags: [],}],
    queryFn: fetchItems
    // queryFn: fetcher
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
    <Box sx={{ height: '100%', bgcolor: 'paper',}}>
      <Box  key='top-pagination'
            sx={{
              display: 'flex', justifyContent: 'flex-end',
              my: 2
            }}>
        <Stack spacing={2} >
          <Pagination count={Math.ceil(data.length/recordsPerPage)} page={page} onChange={handleChange} />
        </Stack>

        {/* <Stack spacing={2} >
          <Pagination count={Math.ceil(items.length/recordsPerPage)} page={page} onChange={handleChange} />
        </Stack> */}
      </Box>
      <Paper key='content'>
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                gap: 2,
            }}
            >
          {items.slice((page-1)*recordsPerPage, page*recordsPerPage).map((val, _) => (
            <Box key={val.id} sx={{ height: '100%',  p: 2}}>
              <Typography key='link' variant="body1" component="div">
                <Link  color="text.primary" href={`/item/${val.id}`}>{val.summary}</Link>
              </Typography>
              <Typography key='description' component="div" variant="caption" color="text.secondary">
                {val.description.substr(0, 100) + '...'}
              </Typography>
              <Typography key='tag-header' component="span" variant="body1" color="text.tertiary">
                Tags: &nbsp;&nbsp;
              </Typography>
              <Typography key='tag-content' component="span" variant="body2" color="text.tertiary">
                {val.tags.join(", ")}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      <Box  key='bottom-pagination'
            sx={{ display: 'flex', justifyContent: 'flex-end',
                  my: 2}}>
        <Stack spacing={2} >
          <Pagination count={Math.ceil(items.length/recordsPerPage)} page={page} onChange={handleChange} />
        </Stack>
      </Box>
    </Box>
  );
}
