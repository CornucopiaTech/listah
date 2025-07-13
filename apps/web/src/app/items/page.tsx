
import * as React from 'react';
import { Suspense } from 'react';
import {
  Box
} from '@mui/material';
import api, {
  type Context,
  propagation,
  trace,
  Span,
  context,
} from '@opentelemetry/api';
import { B3Propagator, B3InjectEncoding } from '@opentelemetry/propagator-b3';
import { CompositePropagator } from '@opentelemetry/core';
import type { IProtoItems, IProtoItem, ITraceBaggage } from '@/app/items/ItemsModel';
import ItemsList from './ItemsList';
import { ItemsDrawer } from "@/app/items/ItemsDrawer";
import ItemsDatePicker from "@/app/items/ItemsDatePicker";
import ItemsSearch from '@/app/items/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';
import { ErrorAlerts } from '@/components/ErrorAlert';
import ItemsPageHeader from './ItemsPageHeader';


api.propagation.setGlobalPropagator(
  new CompositePropagator({
    propagators: [
      new B3Propagator(),
      new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER }),
    ],
  })
);

export default function ItemsPage() {

  // Create an output object that conforms to that interface.
  const output: ITraceBaggage = {};
  propagation.inject(context.active(), output);
  const { traceparent } = output;
  const parentTraceId = traceparent ? traceparent : "";
  let url = process.env.LISTAH_API_ITEMS_READ ? process.env.LISTAH_API_ITEMS_READ : process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ;

  return (
    <Box sx={{
      bgcolor: 'pink',
      height: `calc(100% - ${AppBarHeight})`,
      mt: AppBarHeight, p: 1
    }}>
      {/* <ItemsPageHeader /> */}
      <ItemsList traceparent={parentTraceId} url={url}/>
      {/* <Suspense fallback={<Loading />}>
        <ItemsList parentTraceId={parentTraceId} />
      </Suspense> */}
    </Box>
  );


}
