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

export function ItemsView(){

  return (
    <Box sx={{ bgcolor: 'blue', height: '100vh', p: 2, m: 8 }}>
      <Box sx={{ bgcolor: 'green', display: 'inline-flex' }}>
        <ItemsDrawer />
        <ItemsDatePicker />
      </Box>

      <DataTable />
    </Box>
  );
}
