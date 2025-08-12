import {
  Fragment,
  ReactNode,
} from 'react';
import {
  Box,
  Paper,
} from '@mui/material';


export default function ItemNoContent(): ReactNode {
  return(
    <Fragment>
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
    </Fragment>
  );
}
