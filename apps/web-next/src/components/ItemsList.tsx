'use client'
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
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
} from '@mui/material';



import { getDemoItems } from '@/repository/fetcher';

export default function ItemsList() {
  const items = getDemoItems([], [], []);
  const recordsPerPage = 18;

  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ height: '100%', bgcolor: 'paper',}}>
      <Box  key='top-pagination'
            sx={{ display: 'flex', justifyContent: 'flex-end',
                  my: 2}}>
        <Stack spacing={2} >
          <Pagination count={Math.ceil(items.length/recordsPerPage)} page={page} onChange={handleChange} />
        </Stack>
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
