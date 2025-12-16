
import { Fragment, useContext, type ReactNode } from 'react';
import {
  LinearProgress,
  Skeleton,
  Box,
  CircularProgress,
  Grid
} from '@mui/material';
// import  from '@mui/material/Grid';

// import { AppBarHeight } from '@/lib/model/appNavBarModel';
// import { AppBarHeight } from '@/lib/model/appNavBarModel.ts';
// import { WebAppContext } from '@/lib/context/webappContext.tsx';
import { WebAppContext } from '../../lib/context/webappContext.js';



export default function Loading(): ReactNode {
  const { AppBarHeight } = useContext(WebAppContext);
  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex', //height: `calc(100% - ${AppBarHeight})`,
          mt: '164px', p: 1, justifyContent: 'center', alignItems: 'center'
        }}>
        {/* <LinearProgress /> */}
        <CircularProgress size="6rem" />
        {/* <Skeleton variant="rectangular" width='80%' height='50%' sx={{ height: `calc(100% - ${appBarHeight})`, mt: appBarHeight, p: 1 }} /> */}
      </Box>
    </Fragment>
    // <Box sx={{ flexGrow: 1, mt: AppBarHeight + 100, height: `calc(100% - ${AppBarHeight})` }}>
    //   <LinearProgress />
    //   <Grid container spacing={2}>
    //     <Grid size={2}>
    //       <Box />
    //     </Grid>
    //     <Grid size={8}>
    //       <CircularProgress />
    //     </Grid>
    //     <Grid size={2}>
    //       <Box />
    //     </Grid>
    //   </Grid>
    // </Box>
  );
}
