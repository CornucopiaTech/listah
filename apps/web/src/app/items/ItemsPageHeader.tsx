"use client"

let dynamic = 'force-dynamic';

import * as React from 'react';
import api, {
  propagation,
  context,
} from '@opentelemetry/api';
import { B3Propagator, B3InjectEncoding } from '@opentelemetry/propagator-b3';
import { CompositePropagator } from '@opentelemetry/core';


import {
  Box,
  Paper,
  Typography,
  Pagination,
  Stack,
  Link,
  Chip,
} from '@mui/material';


import type { IProtoItems, IProtoItem, ITraceBaggage } from '@/app/items/ItemsModel';
import { ItemsDrawer } from "@/app/items/ItemsDrawer";
import ItemsDatePicker from "@/app/items/ItemsDatePicker";
import ItemsSearch from '@/app/items/ItemsSearch';
import ItemsList from '@/app/items/ItemsList';
import { AppBarHeight } from '@/components/AppNavBar';
import { ErrorAlerts } from '@/components/ErrorAlert';



export default function ItemsPageHeader() {
  return (
    <Box key='head-content'
      sx={{
        bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
        my: 2, justifyContent: 'space-between'
      }}>
      <ItemsDrawer />
      <ItemsSearch />
      <ItemsDatePicker />
    </Box>
  );
}
