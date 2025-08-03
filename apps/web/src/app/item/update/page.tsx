'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import {
  Box
} from '@mui/material';


import Loading from '@/components/Loading';
import { AppBarHeight } from '@/components/AppNavBar';
import  ItemDetails from "./ItemDetails";


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
        <ItemDetails pItem={JSON.parse(window.atob(query))}/>
      </Suspense>
    </Box>
  );

}
