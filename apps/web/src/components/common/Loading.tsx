
import { Fragment, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';




export default function Loading(): ReactNode {
  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          mt: '164px', p: 1, justifyContent: 'center', alignItems: 'center'
        }}>
        <CircularProgress size="6rem" />
      </Box>
    </Fragment>
  );
}
