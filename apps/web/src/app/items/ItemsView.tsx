'use client'
import { Suspense, useRef} from "react";
// import { useDispatch, useSelector } from 'react-redux';
import {
  ListItem,
  Grid,
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


import { ItemsDrawer} from "@/app/items/ItemsDrawer";
import ItemsDatePicker from "@/app/items/ItemsDatePicker";
import ItemsList from "@/app/items/ItemsList";

export function ItemsView(){

  return (
    <Box sx={{ bgcolor: 'rgba(0,0,255,0.1)', height: '100%', p: 2, }}>
      <Box key='head-content' sx={{ bgcolor: 'rgba(0,255,0,0.1)', display: 'inline-flex' }}>
        <ItemsDrawer />
        <ItemsDatePicker />
      </Box>
      <ItemsList key='item-list' />
    </Box>
  );
}
