"use client"

import {
  Fragment,
  ReactNode,
} from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// import Link from 'next/link';
import {
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Divider,
} from '@mui/material';
// import {
//   Create,
//   Send,
//   Delete,
//   Add,
//   ExpandLess,
//   ArrowBackIosNewOutlined,
//   ArrowForwardIosOutlined,
// } from '@mui/icons-material';


import { useItemsStore } from '@/lib/store/items/ItemStoreProvider';
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
import ItemsPagination from './ItemsPagination';
import ItemNoContent from './ItemsNoContent';

export default async function ItemsPage(): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    pageRecordCount,
    currentPage,
    categoryFilter,
    tagFilter,
    modalOpen,
    inEditMode,
    updateItemsPageRecordCount,
    updateItemsCurrentPage,
    updateItemsCategoryFilter,
    updateItemsTagFilter,
    updateModal,
    updateEditMode,
  } = useItemsStore((state) => state);
  const userId: string = "4d56128c-5042-4081-a0ef-c2d064700191";
  const u = searchParams.get("u") ? searchParams.get("u") : userId;
  const p = searchParams.get("p") ? Number(searchParams.get("p")) : currentPage;
  const rpp = searchParams.get("rpp") ? Number(searchParams.get("rpp")) : pageRecordCount;
  const c = searchParams.get("c") ? JSON.parse(searchParams.get("c")) : categoryFilter;
  const t = searchParams.get("t") ? JSON.parse(searchParams.get("t")) : tagFilter;

  const params = new URLSearchParams(searchParams);
  params.set('u', u);
  params.set('p', p.toString());
  params.set('rpp', rpp.toString());
  params.set('c', JSON.stringify(c));
  params.set('t', JSON.stringify(t));
  router.replace(`${pathname}?${params.toString()}`);


}
