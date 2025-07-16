
import * as React from 'react';

import {
  Box
} from '@mui/material';
import {
  propagation,
  context,
} from '@opentelemetry/api';
import type {  ITraceBaggage } from '@/app/items/ItemsModel';
import ItemsList from './ItemsList';
import { ItemsDrawer } from "@/app/items/ItemsDrawer";
import ItemsDatePicker from "@/app/items/ItemsDatePicker";
import ItemsSearch from '@/app/items/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';



export default function ItemsPage() {

  // Create an output object that conforms to that interface.
  const output: ITraceBaggage = {};
  propagation.inject(context.active(), output);

  const { traceparent, b3 } = output;
  const parentTraceId = traceparent ? traceparent : b3 ? b3 : "";
  let url = process.env.LISTAH_API_ITEMS_READ ? process.env.LISTAH_API_ITEMS_READ : process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ;

  return (
    <Box sx={{
      bgcolor: 'pink',
      height: `calc(100% - ${AppBarHeight})`,
      mt: AppBarHeight, p: 1
    }}>
      {/* <ItemsPageHeader /> */}
      <Box key='head-content'
        sx={{
          bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
          my: 2, justifyContent: 'space-between'
        }}>
          <React.Suspense fallback={<Loading />}>
            <ItemsDrawer />
            <ItemsSearch />
            <ItemsDatePicker />
          </React.Suspense>
      </Box>
      <React.Suspense fallback={<Loading />}>
        <ItemsList traceparent={parentTraceId} url={url}/>
      </React.Suspense>

    </Box>
  );

}
