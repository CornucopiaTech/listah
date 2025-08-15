"use client"

import {
  ReactNode,
} from 'react';
// import Link from 'next/link';
import {
  // Box,
  // Typography,
  // Stack,
  // Chip,
  // Button,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  // useSearchParams, usePathname,
  useRouter
} from 'next/navigation';

import { ItemProto, ItemsState } from '@/lib/model/ItemsModel';
import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';
// import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
// import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
// import ItemsSearch from '@/app/items/read/ItemsSearch';
// import { AppBarHeight } from '@/components/AppNavBar';
// import Loading from '@/components/Loading';
// import { ErrorAlerts } from '@/components/ErrorAlert';
// import MenuSelect from '@/components/MenuSelect';
// import ItemsPagination from './ItemsPagination';
// import ItemNoContent from './ItemsNoContent';


export default function ItemsListStack({ item }: { item: ItemProto}): ReactNode {
  const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const {
    // itemsPerPage,
    // currentPage,
    // categoryFilter,
    // tagFilter,
    // modalOpen,
    // inEditMode,
    // updateItemsPageRecordCount,
    // updateItemsCurrentPage,
    // updateItemsCategoryFilter,
    // updateItemsTagFilter,
    // updateModal,
    updateEditMode,

  } = useItemsStore((state) => state);
  const {
    setState
  } = useUpdatedItemStore((state) => state);


  function handleClick(item: ItemsState | ItemProto) {
    updateEditMode(false);
    setState(item);
    const q = window.btoa(JSON.stringify(item));
    router.push(`/item/read?q=${q}`);
  }

  return (
    <ListItemButton key={item.id} onClick={() => handleClick(item)}>
      <ListItemText primary={item.summary} />
    </ListItemButton>
  );
}
