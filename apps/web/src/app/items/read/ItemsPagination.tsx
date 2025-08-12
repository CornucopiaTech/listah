"use client"

import { redirect, RedirectType } from 'next/navigation';
import {
  Fragment,
  ReactNode,
  useState,
} from 'react';
import Link from 'next/link'
import {
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Pagination,
  Divider,
  Modal,
  Button,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Create,
  Send,
  Delete,
  Add,
  ExpandLess,
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';


import { useItemsStore } from '@/lib/store/items/ItemsStoreProvider';
import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
import ItemsSearch from '@/app/items/read/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import MenuSelect from '@/components/MenuSelect';
import {ItemModalEnabled, ItemModalDisabled} from './ItemModal';
import ItemsListStack from './ItemsListStack';

const modelStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

async function getItems(userId: string, category: string | string [], tags: string[], pageNumber: number, recordsPerPage: number): Promise<IProtoItems|void> {
  const req = new Request('/api/getItems', {
    method: "POST",
    body: JSON.stringify({userId, category, tags, pageNumber, recordsPerPage})
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

export function getItemsGroupOptions(userId: string, category: string | string [], tags: string[], pageNumber: number, recordsPerPage: number) {
  return queryOptions({
     queryKey: ["getItems", userId, category, tags, pageNumber, recordsPerPage],
     queryFn: () => getItems(userId, category, tags, pageNumber, recordsPerPage),
     staleTime: 24 * 60 * 60 * 1000,
   })
}

export default function ItemsPagination({
  maxPages, page, recordsPerPage, handlePageChange, handlePageCountChange
}: {
  maxPages: number, page: number, recordsPerPage: number,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
  handlePageCountChange: (event: React.ChangeEvent<unknown>) => void,
}): ReactNode {

  return (
    <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
      <Pagination count={maxPages} page={page} onChange={handlePageChange} />
      <MenuSelect defaultValue={recordsPerPage}
          handleChange={handlePageCountChange}
          formHelperText="Items per page" label="Page count"
          menuItems={[
            {label: 10, value: 10}, {label: 20, value: 20},
            {label: 50, value: 50}, {label: 100, value: 100}]}/>
    </Box>
  );
}
