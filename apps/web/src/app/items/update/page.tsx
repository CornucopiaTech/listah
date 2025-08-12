"use client"

import { Suspense } from 'react';

import {
  Box
} from '@mui/material';
import {
  propagation,
  context,
  trace
} from '@opentelemetry/api';
import type {  ITraceBaggage } from '@/app/items/ItemsModel';
import ItemsUpdate from '@/app/items/update/ItemsUpdate';
import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
import ItemsSearch from '@/app/items/read/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';



export default function ItemsPage() {
  const output: ITraceBaggage = {};
  propagation.inject(context.active(), output);
  const { traceparent, b3 } = output;
  const activeSpan = trace.getActiveSpan();

  console.info("ITEMS PAGE - output");
  console.info(output);
  console.info("ITEMS PAGE - activeSpan");
  console.info(activeSpan?.spanContext());


  return (
    <Box  sx={{ bgcolor: 'pink', height: `calc(100% - ${AppBarHeight})`,
            mt: AppBarHeight, p: 1 }}>
      <Box key='head-content'
        sx={{ bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
          my: 2, justifyContent: 'space-between' }}>
          <Suspense fallback={<Loading />}>
            <ItemsDrawer />
            <ItemsSearch />
            <ItemsDatePicker />
          </Suspense>
      </Box>
      <Suspense fallback={<Loading />}> <ItemsUpdate /> </Suspense>

    </Box>
  );

}
