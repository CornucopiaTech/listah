'use client'

import { Suspense } from 'react';

import {
  Box
} from '@mui/material';


import Loading from '@/components/Loading';
import { AppBarHeight } from '@/components/AppNavBar';
import  ItemRead from "./ItemRead";


export default function ItemDetailsPage() {
  return <Box sx={{
    height: `calc(100% - ${AppBarHeight})`,
    mt: AppBarHeight, p: 1
  }}>
    <Suspense fallback={<Loading />}>
      <ItemRead />
    </Suspense>
  </Box>

