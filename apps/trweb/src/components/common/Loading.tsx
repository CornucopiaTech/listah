
import { Fragment, useContext, type ReactNode } from 'react';
import {
  LinearProgress,
  Skeleton,
  Box,
  CircularProgress
} from '@mui/material';


// import { AppBarHeight } from '@/lib/model/appNavBarModel';
// import { AppBarHeight } from '@/lib/model/appNavBarModel.ts';
import { WebAppContext } from '@/lib/context/webappContext.tsx';
// import { WebAppContext } from '../../lib/context/webappContext.tsx';



export default function Loading(): ReactNode {
  const { appBarHeight }: { appBarHeight: string } = useContext(WebAppContext);
  return (
    <Fragment>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', height: `calc(100% - ${appBarHeight})`, mt: `calc(10% + ${appBarHeight})`, p: 1, justifyContent: 'center', alignContent: 'center' }}>
        {/* <LinearProgress /> */}
      <CircularProgress size="6rem" />
        {/* <Skeleton variant="rectangular" width='80%' height='50%' sx={{ height: `calc(100% - ${appBarHeight})`, mt: appBarHeight, p: 1 }} /> */}
      </Box>
    </Fragment>
  );
}
