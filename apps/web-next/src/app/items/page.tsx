'use client'

import {
  Box
} from '@mui/material';
import {
  type Context,
  propagation,
  trace,
  Span,
  context,
} from '@opentelemetry/api';


import { ItemsDrawer} from "@/app/items/ItemsDrawer";
import ItemsDatePicker from "@/app/items/ItemsDatePicker";
import ItemsList, { getItemsList } from "@/app/items/ItemsList";
import ItemsSearch from '@/app/items/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';

interface Carrier {
  traceparent?: string;
  tracestate?: string;
}


export default function Items() {

  // Create an output object that conforms to that interface.
  const output: Carrier = {};

  // Serialize the traceparent and tracestate from context into
  // an output object.
  //
  // This example uses the active trace context, but you can
  // use whatever context is appropriate to your scenario.
  propagation.inject(context.active(), output);
  const { traceparent } = output;
  console.info(`Page 1. Output object: ${JSON.stringify(output)}`);


  return (
    <Box  sx={{ bgcolor: 'pink',
                height: `calc(100% - ${AppBarHeight})`,
                mt: AppBarHeight, p: 1 }}>
      <Box  key='head-content'
            sx={{ bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
            my: 2, justifyContent: 'space-between' }}>
        <ItemsDrawer />
        <ItemsSearch />
        <ItemsDatePicker />
      </Box>
      <ItemsList key='item-list' traceparent={traceparent} />
      {/* {listedItems} */}
    </Box>
  );
}
