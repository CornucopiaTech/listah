"use server"


import * as React from 'react';
import {
  LinearProgress,
  Skeleton,
} from '@mui/material';




export default async function LoadingAsync() {

  return (
    <React.Fragment>
      <LinearProgress />
      <Skeleton variant="rectangular" width='80%' height='100%' />
    </React.Fragment>
  );

}
