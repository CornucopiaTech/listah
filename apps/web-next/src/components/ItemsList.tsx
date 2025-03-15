import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Pagination,
  Stack
} from '@mui/material';



import { getDemoItems } from '@/repository/fetcher';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


export default function ItemsList() {
  const items = getDemoItems([], [], []);
  const recordsPerPage = 20;

  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    // <Box sx={{ flexGrow: 1, height: '100%', p:2, }}>
    <Box sx={{ height: '100%', p:2, }}>
      <Box sx={{justifyContent: 'flex-end'}}>
        <Stack spacing={2}>
          {/* <Typography>Page: {page}</Typography> */}
          <Pagination count={Math.ceil(items.length/recordsPerPage)} page={page} onChange={handleChange} />
        </Stack>
      </Box>
      <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {items.slice((page-1)*recordsPerPage, page*recordsPerPage).map((val, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            {/* <Item>{val.summary}</Item> */}
            <Card>
              <CardActionArea
                sx={{
                  height: '100%',
                }}
                >
                <CardContent sx={{ height: '100%' }}>
                  <Typography variant="body1" component="div">
                    {val.summary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {val.description.substr(0, 100) + '...'}
                  </Typography>
                  <Typography variant="body2" color="text.tertiary">
                    {val.tags.join(", ")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ p:2, }}>
        <Stack spacing={2}>
          {/* <Typography>Page: {page}</Typography> */}
          <Pagination count={Math.ceil(items.length/recordsPerPage)} page={page} onChange={handleChange} />
        </Stack>
      </Box>
    </Box>
  );
}
