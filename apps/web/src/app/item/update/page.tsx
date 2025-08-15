'use client'

import { Suspense } from 'react';

import {
  Box
} from '@mui/material';


import Loading from '@/components/Loading';
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import  ItemUpdate from "./ItemUpdate";


export default function ItemUpdatePage() {
  return (
    <Box  sx={{ height: `calc(100% - ${AppBarHeight})`,
          mt: AppBarHeight, p: 1 }}>
      <Suspense fallback={<Loading />}>
        <ItemUpdate />
      </Suspense>
    </Box>
  );
}
