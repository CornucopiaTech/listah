'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import {
  Box
} from '@mui/material';


import Loading from '@/components/Loading';
import { AppBarHeight } from '@/components/AppNavBar';
import  ItemRead from "./ItemRead";


export default function ItemDetailsPage() {
  return <Suspense fallback={<Loading />} >
    < ItemDetailsPageChild />
  </Suspense>
}


export function ItemDetailsPageChild() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ? searchParams.get('q') : "";

  return (
    <Box  sx={{ height: `calc(100% - ${AppBarHeight})`,
          mt: AppBarHeight, p: 1 }}>
      <Suspense fallback={<Loading />}>
        <ItemRead />
      </Suspense>
    </Box>
  );

}
