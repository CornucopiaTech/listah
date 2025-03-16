'use client'

import { Suspense, useRef} from "react";
// import { useDispatch, useSelector } from 'react-redux';
import {
  ListItem,
  Grid2 as Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Skeleton,
  Box
} from '@mui/material';
import {
  ExpandLess
} from '@mui/icons-material';


import { ItemsDrawer} from "@/components/ItemsDrawer";
import DataTable from '@/components/DataTable';
import ItemsDatePicker from "@/components/ItemsDatePicker";
import ItemsList from "@/components/ItemsList";

import {  } from '@/components/AppNavBar';
import { ItemsView } from '@/components/ItemsView';


import { AppBarHeight } from '@/components/AppNavBar';



export default function Items() {
  return (
    <Box  sx={{ bgcolor: 'pink', height: `calc(100% - ${AppBarHeight})`,
          mt: AppBarHeight, p: 1 }}>
      <Box  key='head-content'
            sx={{ bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
            my: 2, justifyContent: 'space-between' }}>
        <ItemsDrawer />
        <ItemsDatePicker />
      </Box>
      <ItemsList key='item-list' />
      {/* <DataTable /> */}
    </Box>
  );
}
