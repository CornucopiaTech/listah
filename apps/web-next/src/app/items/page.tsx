'use client'

import {
  Box
} from '@mui/material';


import { ItemsDrawer} from "@/components/ItemsDrawer";
import ItemsDatePicker from "@/components/ItemsDatePicker";
import ItemsList, { getItemsList } from "@/components/ItemsList";
import ItemsSearch from '@/components/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';



export default function Items() {

  const listedItems = getItemsList("traceId");

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
      {/* <ItemsList key='item-list' /> */}
      {listedItems}
    </Box>
  );
}
