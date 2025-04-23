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
import ItemsList from "./ItemsList";

export function ItemsView(){

  return (
    <Box sx={{ bgcolor: 'rgba(0,0,255,0.1)', height: '100%', p: 2, }}>
      <Box key='head-content' sx={{ bgcolor: 'rgba(0,255,0,0.1)', display: 'inline-flex' }}>
        <ItemsDrawer />
        <ItemsDatePicker />
      </Box>
      <ItemsList key='item-list' />
      {/* <DataTable /> */}
    </Box>
  );
}
