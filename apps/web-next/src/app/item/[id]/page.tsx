'use client'

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  Box
} from '@mui/material';
import {
  propagation,
  context,
} from '@opentelemetry/api';


import type {  ITraceBaggage } from '@/app/items/ItemsModel';
import Loading from '@/components/Loading';
import { AppBarHeight } from '@/components/AppNavBar';
import  ItemDetails from "./ItemDetails";


export default function ItemDetailsPage() {
  return <Suspense fallback={<Loading />} >
    < ItemDetailsPageChild />
  </Suspense>
}


export function ItemDetailsPageChild() {
  const params = useParams<{ id: string }>()
  const { id } = params;
  // Create an output object that conforms to that interface.
  const output: ITraceBaggage = {};
  propagation.inject(context.active(), output);

  const { traceparent, b3 } = output;
  const parentTraceId = traceparent ? traceparent : b3 ? b3 : "";
  let url = process.env.LISTAH_API_ITEMS_READ ? process.env.LISTAH_API_ITEMS_READ : process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ;

  return (
    <Box  sx={{ bgcolor: 'pink', height: `calc(100% - ${AppBarHeight})`,
          mt: AppBarHeight, p: 1 }}>
      <Suspense fallback={<Loading />}>
        <ItemDetails traceparent={parentTraceId} url={url} itemId={id}/>
      </Suspense>
    </Box>
  );

}
