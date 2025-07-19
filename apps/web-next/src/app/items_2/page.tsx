
import { Suspense } from 'react';

import {
  Box
} from '@mui/material';
import {
  propagation,
  context,
  trace,
} from '@opentelemetry/api';


import ItemsList from './ItemsList';
import { ItemsDrawer } from "@/app/items/ItemsDrawer";
import ItemsDatePicker from "@/app/items/ItemsDatePicker";
import ItemsSearch from '@/app/items/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';

import type {  ITraceBaggage } from '@/app/items/ItemsModel';

export default function ItemsPage() {
  const output: ITraceBaggage = {};
  propagation.inject(context.active(), output);
  const { traceparent } = output;
  console.info(`In page: propagation trace context: `);
  console.info(output);

  const result = (
    <Box sx={{
      bgcolor: 'pink',
      height: `calc(100% - ${AppBarHeight})`,
      mt: AppBarHeight, p: 1
    }}>
      <Box key='head-content'
        sx={{
          bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
          my: 2, justifyContent: 'space-between'
        }}>
          <Suspense fallback={<Loading />}>
            <ItemsDrawer />
            <ItemsSearch />
            <ItemsDatePicker />
          </Suspense>
      </Box>
      <Suspense fallback={<Loading />}>
        <ItemsList traceparent={traceparent}/>
      </Suspense>
    </Box>
  );
  return result;
}
