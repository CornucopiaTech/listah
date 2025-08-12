"use client"


import * as React from 'react';
import {
  LinearProgress,
  Skeleton,
} from '@mui/material';




export default function Loading() {

  return (
    <React.Fragment>
      <LinearProgress />
      <Skeleton variant="rectangular" width='80%' height='100%' />
    </React.Fragment>
  );

}
